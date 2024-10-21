"use strict";
const User = require("../../../model/users.model");
const Auction = require("../../../model/orders/auction.model");
const Inventory = require("../../../model/inventory/inventory.model");
const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");
const Product_v2 = require("../../../model/product_v2");
const Interaction = require("../../../model/recommendation/interaction.model");
const Notification = require("../../../model/notification/notification.model");
const { sendMail } = require("../../../config/nodemailler");
// const InventoryOut = require("../../../model/inventories/invenOut.model");
const crypto = require("crypto");
// const momoService  = require('./momo.service');
const mongoose = require("mongoose");
const vnpaySService = require("./vnpay.service");
const { log } = require("console");
// const InventoryOut = require("../../../model/inventory/invenOut.model");

const orderAndDetailService = {
  createOrderWithDetails: async (orderData) => {
    try {
      const { userId, auctionDetails, payment } = orderData;

      // Find user
      const user = await User.findById(userId).lean();
      if (!user) throw new Error("Người dùng không tồn tại");

      // Find auction details
      const auction = await Auction.findById(auctionDetails)
        .populate("productId")
        .lean();

      const auctionID = auction._id;
      // Extract productID from auction details
      const productID = mongoose.Types.ObjectId(auction.productId._id);

      // Validate productID format

      const product = await Product_v2.findById(productID).lean();

      const nameProduct = product.product_name;

      // const testProductID = mongoose.Types.ObjectId("66e3eb3506aa43ec4bc5686b");
      
      // const inven = await Inventory.findOne({ product: productID }).lean();

      // if (!inven) throw new Error("Sản phẩm trong kho không tồn tại");

      // Extract details from auction
      const quantityDetails = auction.auction_quantity;
      const totalAmount = auction.auction_total;
      const totalPriceWithShipping = totalAmount + 31000;

      // Extract user details
      const recipientName = user.name || "Chưa nhập tên";
      const phoneNumber = user.phone || "Chưa nhập số điện thoại";
      const shippingAddress = user.address;

      // Prepare hashLinkPayment

      let hashLinkPayment;
      let paymentMethodText = ""; // Default payment method text

      if (payment === "MoMo") {
        // Generate MoMo payment link
        const momoPaymentLink = `${totalPriceWithShipping}MoMoHash`; // Replace with actual MoMo link
        hashLinkPayment = crypto
          .createHash("sha256")
          .update(momoPaymentLink)
          .digest("hex");
        paymentMethodText = "Thanh toán MoMo";
      } else if (payment === "Cash") {
        const paymentData = `${totalPriceWithShipping}`;
        hashLinkPayment = crypto
          .createHash("sha256")
          .update(paymentData)
          .digest("hex");
        paymentMethodText = "Thanh toán trực tiếp";
      } else if (payment === "VnPay") {
        // Generate VNPay payment URL

        const vnPayHash = `${totalPriceWithShipping}vnPayHash`;
        hashLinkPayment = crypto
          .createHash("sha256")
          .update(vnPayHash)
          .digest("hex");
        paymentMethodText = "Thanh toán VnPay";
      } else {
        throw new Error("Không xác thực phương thức thanh toán");
      }

      // Create order auction
      const orderAuction = new OrderAuction({
        shippingAddress: {
          userID: user._id,
          recipientName,
          phoneNumber,
          address: shippingAddress || "Chưa có địa chỉ",
          email: user.email || "Chưa có mail",
          addressID: user.addressID,
        },
        amount: totalAmount,
        totalPriceWithShipping,
        stateOrder: "Chờ giao hàng",
      });

      await orderAuction.save();

      // Create order detail auction
      const orderDetailAuction = new OrderDetailAuction({
        auction: auctionID,
        order: orderAuction._id,
        productID,
        nameProduct: nameProduct, // Include product name
        quantityDetails,
        totalAmount,
        totalPriceWithShipping,
        payment_method: paymentMethodText,
        formatShipping: "Tiêu chuẩn",
        hashLinkPayment,
      });



      await orderDetailAuction.save();

      // Update product quantity in Inventory
      // const updatedProductQuantity = inven.quantityShelf - quantityDetails;
      // if (updatedProductQuantity < 0) {
      //   throw new Error("Số lượng sản phẩm không đủ");
      // }

      // const numInventoriesShelf = inven.quantityShelf;
      // const numQuantityDetails = quantityDetails;
      // const remainingQuantityShelf = numInventoriesShelf - numQuantityDetails;

      // await Inventory.findOneAndUpdate(
      //   { product: productID },
      //   {
      //     $set: {
      //       product: productID,
      //       quantityShelf: remainingQuantityShelf,
      //       quantityStock: inven.quantityStock,
      //       totalQuantity: inven.totalQuantity,
      //       supplier: inven.supplier,
      //       price: inven.price,
      //       totalPrice: inven.totalPrice,
      //       status: "active",
      //       createdAt: Date.now(),
      //       updateAt: Date.now(),
      //     },
      //   }
      // );

      // Send confirmation email to user
      const orderDetails = {
        products: [
          {
            name: nameProduct, // Use product name for the email
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

      const orderInFo = `Order for auction ${auctionID}`;
      const vnpayResponse = await vnpaySService.createPaymentUrl(
        totalPriceWithShipping,
        auctionID,
        orderInFo
      );
      return {
        orderAuctionID: orderAuction._id,
        orderDetailAuctionID: orderDetailAuction._id,
        hashLinkPayment: vnpayResponse.url,
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
      // Find the order and populate the userID in shippingAddress
      const order = await OrderAuction.findById(orderId)
        .populate("shippingAddress.userID") // Populating userID inside shippingAddress
        .exec();
      console.log('order found', order);
      
      if (!order) throw new Error("Đơn hàng không tồn tại");

      // Find order details related to the order
      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
      }).lean();
      console.log('OrderDetails', orderDetails);
      
      // Fetch product details for each order detail
      const productDetails = await Promise.all(
        orderDetails.map(async (detail) => {
          const product = await Product_v2.findById(detail.productID).lean();
          console.log('products', product);
          
          return {
            name: product.product_name,
            price: detail.totalAmount,
            image: product.image,
          };
        })
      );
      console.log('productDetails' , productDetails);
      
      // Extract the user and address information from the shippingAddress
      const shippingInfo = {
        userId: order.shippingAddress.userID._id,
        recipientName: order.shippingAddress.recipientName,
        phoneNumber: order.shippingAddress.phoneNumber,
        address: order.shippingAddress.address,
        email: order.shippingAddress.userID.email, // Assuming the user's email is stored here
      };
      const orderIds = order._id;

      // Return the consolidated order information
      return {
        orderIds,
        shippingInfo, // Contains recipient, phone, address, and user email
        totalPrice: order.totalPriceWithShipping,
        products: productDetails,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin đơn hàng: ${error.message}`);
    }
  },

  getOrderDetailAdmin: async (orderId) => {
    try {
      // Find the order and populate the userID in shippingAddress
      const order = await OrderAuction.findById(orderId)
        .populate("shippingAddress.userID") // Populating userID inside shippingAddress
        .exec();

      if (!order) throw new Error("Đơn hàng không tồn tại");

      // Find order details related to the order
      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
      }).lean();

      const payment = orderDetails[0].payment_method;
      const totalPriceWithShipping = orderDetails[0].totalPriceWithShipping;
      const date = orderDetails[0].payment_date;
      // Fetch product details for each order detail
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

      // Extract the user and address information from the shippingAddress
      const shippingInfo = {
        userId: order.shippingAddress.userID._id,
        recipientName: order.shippingAddress.recipientName,
        phoneNumber: order.shippingAddress.phoneNumber,
        address: order.shippingAddress.address,
        email: order.shippingAddress.userID.email, // Assuming the user's email is stored here
      };

      // Return the consolidated order information
      return {
        shippingInfo, // Contains recipient, phone, address, and user email
        totalPrice: totalPriceWithShipping,
        products: productDetails,
        state: order.stateOrder,
        paymetMethod: payment,
        orderid: order._id,
        dateOrder: date,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin đơn hàng: ${error.message}`);
    }
  },
  // Function to get orders by user ID
  getOrderByUser: async (userId) => {
    try {
      // Find all orders where the shippingAddress.userID matches the provided userId
      const orders = await OrderAuction.find({
        "shippingAddress.userID": userId,
      })
        .populate("shippingAddress.userID") // Populate the user details inside the shippingAddress
        .lean(); // Use lean to return plain JavaScript objects

      if (!orders || orders.length === 0)
        throw new Error("Không tìm thấy đơn hàng cho người dùng này");

      // Map through the orders to extract relevant shipping information and other order details
      const userOrders = orders.map((order) => ({
        orderId: order._id,
        totalPrice: order.totalPriceWithShipping,
        orderDate: order.createdAt,
        shippingInfo: {
          recipientName: order.shippingAddress.recipientName,
          phoneNumber: order.shippingAddress.phoneNumber,
          address: order.shippingAddress.address,
          email: order.shippingAddress.userID.email, // Assuming email is stored in the user model
        },
        status: order.status, // Include status if required
      }));

      return userOrders; // Return array of orders with relevant details
    } catch (error) {
      throw new Error(`Lỗi khi lấy đơn hàng của người dùng: ${error.message}`);
    }
  },

  completeOrder: async (orderId) => {
    try {
      // Tìm đơn hàng theo ID
      const order = await OrderAuction.findById(orderId).lean();
      if (!order) throw new Error("Đơn hàng không tồn tại");

      // Fetch order details
      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
      }).lean();
      if (!orderDetails || orderDetails.length === 0) {
        throw new Error("No order details found for this order ID");
      }

      // Tạo bản ghi tương tác cho từng sản phẩm trong đơn hàng
      const interactions = await Promise.all(
        orderDetails.map(async (detail) => {
          return await Interaction.create({
            user: order.shippingAddress.userID,
            orderAuctions: orderId,
            productID: detail.productID,
            OrderCart: null,
            Watchlist: null,
            Cart: null,
            item: null, // Lưu thông tin sản phẩm vào productID
            type: "auctions",
            score: 6, // Có thể đặt điểm số chung cho tất cả các sản phẩm, hoặc tùy chỉnh nếu cần
          });
        })
      );

      // Tạo thông báo
      const notification = await Notification.create({
        user: order.shippingAddress.userID,
        order: orderId,
        type: "Thông tin",
        customer_service: null,
        isRead: true,
        message: `Đơn hàng ${orderId} đã được thanh toán hoàn tất. Cảm ơn bạn đã mua hàng!`,
      });

      return {
        message: "Thanh toán hoàn tất và thông báo đã được gửi",
        interactions, // Trả về dữ liệu tương tác đã tạo
        notification, // Trả về dữ liệu thông báo đã tạo
      };
    } catch (error) {
      throw new Error(`Lỗi khi xử lý thanh toán: ${error.message}`);
    }
  },
  getAndUpdateOrdersByUser: async (userId) => {
    try {
      // Tìm các đơn hàng với userID tương ứng và không phải là "Nhận hàng"
      const order = await OrderAuction.findOne({
        userID: userId,
        stateOrder: { $ne: "Nhận hàng" },
      }).exec();

      // Cập nhật stateOrder thành "Nhận hàng"
      order.stateOrder = "Nhận hàng";
      await order.save(); // Save the updated document

      console.log("Updated Order:", order);

      return order;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
    }
  },

  searchOrdersByPhoneNumber: async (search, page, limit = 17) => {
    try {
      // Use defaults if page and limit are not provided
      const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
      const searchQuery = search
        ? {
            status: { $ne: "disable" },
            "shippingAddress.phoneNumber": { $regex: search, $options: "i" },
          }
        : { status: { $ne: "disable" } };
      // Fetch orders matching the phone number and excluding status "disable"
      const orders = await OrderAuction.find(searchQuery)
        .populate("shippingAddress.userID")

        .skip(offset)
        .limit(limit)
        .exec();

      // Count the total number of matching orders for pagination
      const totalOrders = await OrderAuction.countDocuments(searchQuery);

      return {
        orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit), // Total number of pages
        currentPage: page,
      };
    } catch (error) {
      throw new Error(
        `Error searching orders by phone number: ${error.message}`
      );
    }
  },
  getAllOrders: async (search, page, limit) => {
    try {
      const offset = (page - 1) * limit;

      const searchQuery = search
        ? {
            status: { $ne: "disable" },
            "shippingAddress.phoneNumber": { $regex: search, $options: "i" },
          }
        : { status: { $ne: "disable" } };

      const orders = await OrderAuction.find(searchQuery)
        .skip(offset)
        .limit(limit)
        .populate("shippingAddress.userID") // nếu cần thiết
        .sort({ createdAt: -1 });
      const totalOrders = await OrderAuction.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalOrders / limit);
      return {
        success: true,
        data: {
          orders,
          pagination: {
            totalOrders,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
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
        stateOrder: "Nhận hàng",
      }).exec();

      const updatedOrder = await OrderAuction.updateOne(
        { _id: orderToUpdate._id }, // Query by the unique _id of the document
        {
          $set: {
            status: "disable",
            disabledAt: now,
            stateOrder: "Hủy đơn hàng",
          },
        },
        { new: true } // Optionally, return the updated document
      ).exec();

      return { updateOrder: updatedOrder };
    } catch (error) {
      console.error("Error:", error);
      throw new Error(`Lỗi khi xóa mềm đơn hàng: ${error.message}`);
    }
  },
  getDeletedOrders: async (page, limit) => {
    try {
      // Tính toán skip và limit dựa trên số trang và giới hạn (limit)
      // const skip = (page - 1) * limit;
      const pageNum =
        page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
      const limitNum =
        limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 5;
      // Sử dụng Bucket Pattern để phân trang
      const orders = await OrderAuction.find({
        status: "disable",
        stateOrder: "Hủy đơn hàng",
      })
        .populate("shippingAddress.userID")

        .skip((pageNum - 1) * limitNum) // Skip documents based on page
        .limit(limitNum) // Limit the number of documents per page
        .exec();

      //  const shippingInfo = {
      //   userId: orders[0].shippingAddress.userID._id,
      //   recipientName: orders[0].shippingAddress.recipientName,
      //   phoneNumber: orders[0].shippingAddress.phoneNumber,
      //   address: orders[0].shippingAddress.address,
      //   email: orders[0].shippingAddress.userID.email, // Assuming the user's email is stored here
      // };
      // const stateOrder = orders[0].stateOrder

      // Đếm tổng số lượng đơn hàng thỏa mãn điều kiện
      const totalOrders = await OrderAuction.countDocuments({
        status: "disable",
        stateOrder: "Hủy đơn hàng",
      });

      return {
        orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: pageNum,
      };
    } catch (error) {
      throw new Error(`Error retrieving deleted orders: ${error.message}`);
    }
  },
};
// const calculateScore = (interactions) => {
//   let score = 0;
//   interactions.forEach((interaction) => {
//     switch (interaction.type) {
//       case "view":
//         score += 1; // Mỗi lần xem, tăng 1 điểm
//         break;
//       case "purchase":
//         score += 5; // Mỗi lần mua, tăng 5 điểm
//         break;
//       case "rating":
//         score += interaction.rating; // Dùng điểm đánh giá làm score
//         break;
//       case "auctions":
//         score += 5;
//         break;
//       case "comment":
//         score += 3;
//         break;
//       case "addWhishList":
//         score += 4;
//         break;
//       default:
//         score += 0;
//     }
//   });
//   return score;
// };

module.exports = orderAndDetailService;
