"use strict";
const User = require("../../../model/users.model");
const Auction = require("../../../model/orders/auction.model");
const Inventory = require("../../../model/inventories/inventory.model");
const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");
const Product_v2 = require("../../../model/product_v2");
const Interaction = require("../../../model/recommendation/interaction.model");
const Notification = require("../../../model/notification/notification.model");
const { sendMail } = require("../../../config/nodemailler");
const InventoryOut = require("../../../model/inventories/invenOut.model");
const { ObjectId } = require("mongodb"); // CommonJS

const mongoose = require("mongoose");
const orderAndDetailService = {
  createOrderWithDetails: async (userID, auctionDetails) => {
    try {
      // Tìm người dùng
      const user = await User.findById(userID).lean();
      if (!user) throw new Error("Người dùng không tồn tại");

      // Tìm phiên đấu giá
      const auction = await Auction.findById(auctionDetails)
        .populate("productId")
        .lean();

      // Lấy productID từ auctionDetails
      const productID = auction.productId;

      const auctionID = auction._id;
      const inven = await Inventory.find({ product: productID }).lean();
      if (!inven) throw new Error("Sản phẩm không tồn tại");

      const invenArr = inven[0];

      // Lấy thông tin chi tiết từ auctionDetails
      const quantityDetails = auction.auction_quantity;
      const totalAmount = auction.auction_total;
      const totalPriceWithShipping = totalAmount + 31000;

      // Lấy thông tin người nhận từ user
      const recipientName = user.name;
      const phoneNumber = user.phone;
      const shippingAddress = user.address;

      // Tạo đơn hàng đấu giá
      const orderAuction = new OrderAuction({
        shippingAddress: {
          userID: user._id,
          recipientName,
          phoneNumber,
          address: shippingAddress,
          email: user.email,
          addressID: user.addressID,
        },

        amount: totalAmount,
        totalPriceWithShipping,
        stateOrder: "Chờ giao hàng",
      });

      await orderAuction.save();

      // Tạo chi tiết đơn hàng đấu giá
      const orderDetailAuction = new OrderDetailAuction({
        auction: [auctionID],
        order: orderAuction._id,
        productID,
        nameProduct: productID.product_name, // Include product name
        quantityDetails,
        totalAmount,
        totalPriceWithShipping,
        payment_method: "Thanh toán trực tiếp",
        formatShipping: "Tiêu chuẩn",
      });

      await orderDetailAuction.save();

      // Update product quantity in ProductV2
      // Ensure that quantityDetails is defined and a valid number
      if (typeof quantityDetails !== "number") {
        throw new Error("quantityDetails must be a valid number");
      }

      const updatedProductQuantity = inven[0].quantityShelf - quantityDetails;

      const inventoryId = inven[0]._id;
      const invenObjID = inven[0]._id;

      const inventoriesShelf = inven[0].quantityShelf;
      const invetoryPrice = inven[0].price;

      const invetoryQuantityStock = inven[0].quantityStock;
      const inventoryTotalQuantity = inven[0].totalQuantity; // Corrected typo from totalQuatity to totalQuantity

      if (updatedProductQuantity < 0) {
        throw new Error("Số lượng sản phẩm không đủ");
      }

      const totalQuantityOut = quantityDetails;

      // Kiểm tra và đảm bảo các giá trị không phải là NaN hoặc undefined
      const remainingQuantitySheft = inventoriesShelf - quantityDetails;
      const remainingQuantityStock = invetoryQuantityStock - quantityDetails;
      const remainingTotalQuantity = inventoryTotalQuantity - quantityDetails;
      const remainingValue = remainingTotalQuantity * invetoryPrice;

      if (isNaN(remainingValue) || isNaN(remainingTotalQuantity)) {
        throw new Error(
          "Giá trị tính toán không hợp lệ. Vui lòng kiểm tra lại các biến đầu vào."
        );
      }

      const invenOut = new InventoryOut({
        inventory: [inventoryId],
        quantitySheftOut: -quantityDetails,
        quantityStockOut: -quantityDetails,
        totalQuantityOut: -quantityDetails,
        salePrice: invetoryPrice,
        saleValue: invetoryPrice * totalQuantityOut,
        reason: "trade",
        remainingQuantitySheft,
        remainingQuantityStock,
        remainingTotalQuantity,
        remainingsalePrice: invetoryPrice,
        remainingValue, // Sử dụng giá trị đã tính và kiểm tra
      });

      await invenOut.save();

      const numInventoriesShelf = Number(inventoriesShelf);
      const numQuantityDetails = Number(quantityDetails);

      const remainingQuantityShelf = numInventoriesShelf - numQuantityDetails;

      // const preUpdate = await Inventory.findById(invenObjIDConverted);
      // console.log("Before update:", preUpdate);

      // Perform update
      const updateResult = await Inventory.findOneAndUpdate(
        { product: productID },
        {
          $set: {
            product: productID,

            quantityShelf: remainingQuantityShelf,
            quantityStock: inven[0].quantityStock,
            totalQuantity: inven[0].totalQuantity,
            supplier: inven[0].supplier,
            price: inven[0].price,
            totalPrice: inven[0].totalPrice,
            status: "active",
            createdAt: Date.now(),
            updateAt: Date.now(),
          },
        }
        // Decrement quantityShelf
        // Return the updated document
      );

      // Check after update
      // const postUpdate = await Inventory.findById(invenObjIDConverted);
      // console.log("After update:", postUpdate);
      // Send confirmation email to user
      const orderDetails = {
        products: [
          {
            name: productID.product_name, // Use product name for the email
          },
        ],
        quantityShopping: quantityDetails,
        totalPrice: totalPriceWithShipping,
        shipping: {
          name: recipientName, // Recipient's name
          address: shippingAddress, // Shipping address
          sdt: phoneNumber, // Phone number
        },
      };

      await sendMail(user.email, orderDetails);

      return {
        orderAuctionID: orderAuction._id,
        orderDetailAuctionID: orderDetailAuction._id,
        updateInven: updateResult,
      };
    } catch (error) {
      throw error;
    }
  },

  getAuctionProductDetails: async (auctionId) => {
    try {
      const auction = await Auction.findById(auctionId).lean();
      if (!auction) throw new Error("Phiên đấu giá không tồn tại");
      const productID = auction.productId;

      const product = await Product_v2.findById(productID).lean();
      if (!product) throw new Error("Sản phẩm không tồn tại");

      return {
        name: product.product_name,
        price: auction.auction_total,
        image: product.image,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${error.message}`);
    }
  },
  getOrderDetails: async (orderId) => {
    try {
      const order = await OrderAuction.findById(orderId)
        .populate("shippingAddress.userID")
        .exec();
      if (!order) throw new Error("Đơn hàng không tồn tại");

      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
      }).lean();

      const productDetails = await Promise.all(
        orderDetails.map(async (detail) => {
          const product = await Product_v2.findById(detail.productID).lean();

          return {
            name: product.product_name,
            price: detail.totalAmount,
            image: product.image,
          };
        })
      );

      return {
        shippingAddress: order.shippingAddress,
        totalPrice: order.totalPriceWithShipping,
        products: productDetails,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin đơn hàng: ${error.message}`);
    }
  },
  completeOrder: async (orderId) => {
    try {
      const order = await OrderAuction.findById(orderId).lean();
      if (!order) throw new Error("Đơn hàng không tồn tại");

      // Fetch order details
      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
      }).lean();
      if (!orderDetails || orderDetails.length === 0) {
        throw new Error("No order details found for this order ID");
      }

      // Fetch interactions related to the order
      // const interactions = await Interaction.findById({ orderAuctions: orderId }).lean();

      // Calculate score, default to 0 if no interactions

      // Tính điểm số cho mô hình học (ví dụ: dựa trên tổng giá đơn hàng)

      // Hàm tính điểm số dựa trên giá trị đơn hàng

      // Tạo bản ghi tương tác cho từng sản phẩm trong đơn hàng
      await Promise.all(
        orderDetails.map(async (detail) => {
          await Interaction.create({
            user: order.shippingAddress.userID,
            orderAuctions: orderId,
            productID: detail.productID, // Lưu thông tin sản phẩm vào productID
            type: "auctions",
            score: 5, // Có thể đặt điểm số chung cho tất cả các sản phẩm, hoặc tùy chỉnh nếu cần
            item: null, // Để trống cho các tương tác không liên quan đến sản phẩm cụ thể
          });
        })
      );

      await Notification.create({
        user: order.shippingAddress.userID,
        order: orderId,
        type: "Thông tin",
        customer_service: null,
        isRead: true,
        message: `Đơn hàng ${orderId} đã được thanh toán hoàn tất. Cảm ơn bạn đã mua hàng!`,
      });

      return { message: "Thanh toán hoàn tất và thông báo đã được gửi" };
    } catch (error) {
      throw new Error(`Lỗi khi xử lý thanh toán: ${error.message}`);
    }
  },
  getAndUpdateOrdersByUser: async (userId) => {
    try {
      // Tìm các đơn hàng với userID tương ứng và không phải là "Nhận hàng"
      const order = await OrderAuction.findOne({
      
        userID: userId,
        stateOrder: { $ne: "Nhận hàng" }
      }).exec();

      // Cập nhật stateOrder thành "Nhận hàng"
      order.stateOrder = "Nhận hàng";
      await order.save(); // Save the updated document
  
      console.log('Updated Order:', order);

    

      return order;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
    }
  },
  getAllOrders: async (page = 1, limit = 5) => {
    try {
      const orders = await OrderAuction.find({ status: { $ne: "disable" } })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

        .exec();

      const totalOrders = await OrderAuction.countDocuments({
        status: { $ne: "disable" },
      });

      return {
        orders,
        totalOrders,
      };
    } catch (error) {
      throw new Error(`Error retrieving orders: ${error.message}`);
    }
  },

  getOrderById: async (id) => {
    try {
      const order = await OrderAuction.findById(id)
        .populate("shippingAddress.userID")
        .populate("auctionDetails")
        .exec();

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      throw new Error(`Error retrieving order by ID: ${error.message}`);
    }
  },

  restoreOrder: async (id) => {
    try {
      const order = await OrderAuction.findByIdAndUpdate(
        id,
        { status: "active", stateOrder: "Chờ giao hàng", disabledAt: null },
        { new: true }
      ).exec();

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      throw new Error(`Error restoring order: ${error.message}`);
    }
  },

  softDeleteOrder: async (id) => {
    try {
      const nowUtc = new Date();

      // Chuyển đổi thời gian UTC về múi giờ Việt Nam
      // Múi giờ Việt Nam là UTC + 7 giờ
      const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
      const now = new Date(nowUtc.getTime() + offset);
      const order = await OrderAuction.findByIdAndUpdate(
        id,
        { status: "disable", disabledAt: now },
        { new: true }
      ).exec();

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      console.error("errors:", error);
      throw new Error(`Error soft deleting order: ${error.message}`);
    }
  },
  softDeleteReceivedOrdersByUser: async (userId) => {
    try {
      const nowUtc = new Date();
      const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
      const now = new Date(nowUtc.getTime() + offset);

      // Tìm và xóa mềm các đơn hàng có stateOrder là "Nhận hàng"
      const orderToUpdate = await OrderAuction.findOne({
        userID: userId,
        stateOrder: "Nhận hàng"
      }).exec();
    
      const updatedOrder = await OrderAuction.updateOne(
        { _id: orderToUpdate._id }, // Query by the unique _id of the document
        { 
          $set: { 
            status: "disable", 
            disabledAt: now, 
            stateOrder: "Hủy bỏ" 
          } 
        },
        { new: true } // Optionally, return the updated document
      ).exec();
   
        

     

      return {updateOrder : updatedOrder}
    } catch (error) {
      console.error("Error:", error);
      throw new Error(`Lỗi khi xóa mềm đơn hàng: ${error.message}`);
    }
  },
  getDeletedOrders: async (page = 1, limit = 5) => {
    try {
      // Tính toán skip và limit dựa trên số trang và giới hạn (limit)
      const skip = (page - 1) * limit;

      // Sử dụng Bucket Pattern để phân trang
      const orders = await OrderAuction.find({
        status: "disable",
        stateOrder: "Hủy bỏ",
      })
        .populate("shippingAddress.userID")
        .populate("auctionDetails")
        .skip(skip)
        .limit(limit)
        .exec();

      // Đếm tổng số lượng đơn hàng thỏa mãn điều kiện
      const totalOrders = await OrderAuction.countDocuments({
        status: "disable",
        stateOrder: "Hủy bỏ",
      });

      return {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        orders,
      };
    } catch (error) {
      throw new Error(`Error retrieving deleted orders: ${error.message}`);
    }
  },

  searchOrdersByPhoneNumber: async (phoneNumber) => {
    try {
      return await OrderAuction.find({
        "shippingAddress.phoneNumber": phoneNumber,
      })
        .populate("shippingAddress.userID")
        .populate("auctionDetails")
        .exec();
    } catch (error) {
      throw new Error(
        `Error searching orders by phone number: ${error.message}`
      );
    }
  },
};
const calculateScore = (interactions) => {
  let score = 0;
  interactions.forEach((interaction) => {
    switch (interaction.type) {
      case "view":
        score += 1; // Mỗi lần xem, tăng 1 điểm
        break;
      case "purchase":
        score += 5; // Mỗi lần mua, tăng 5 điểm
        break;
      case "rating":
        score += interaction.rating; // Dùng điểm đánh giá làm score
        break;
      case "auctions":
        score += 5;
        break;
      case "comment":
        score += 3;
        break;
      case "addWhishList":
        score += 4;
        break;
      default:
        score += 0;
    }
  });
  return score;
};

module.exports = orderAndDetailService;
