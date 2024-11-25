"use strict";
const User = require("../../../model/users.model");
const Auction = require("../../../model/orders/auction.model");
const Inventory = require("../../../model/inventory/inventory.model");
const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");
const Product_v2 = require("../../../model/productAuction/productAuction");
const Interaction = require("../../../model/recommendation/interaction.model");
const Notification = require("../../../model/notification/notification.model");
const { sendMail } = require("../../../config/nodemailler");
const { spawn } = require('child_process');

// const InventoryOut = require("../../../model/inventories/invenOut.model");
const crypto = require("crypto");
// const momoService  = require('./momo.service');
const mongoose = require("mongoose");
const vnpaySService = require("./vnpay.service");

// const InventoryOut = require("../../../model/inventory/invenOut.model");

const orderAndDetailService = {
  createOrderWithDetails: async (orderData) => {
    try {
      const { userId, auctionDetails, payment } = orderData;
      // 
      /**
       * 
       * @readonly Sau 24h ; nếu người dùng ko thanh toán thì thì auction bị hủy
       */
      // Find user
      const user = await User.findById(userId).lean();
      if (!user || user.status === "disable") throw new Error("Người dùng không tồn tại");

      // Find auction details
      const auction = await Auction.findById(auctionDetails)
        .populate("productId")
        .lean();
      if (!auction || auction.status === "disable") throw new Error("Đấu giá không tồn tại");
      const auctionID = auction._id;
      // Extract productID from auction details
      const productID = mongoose.Types.ObjectId(auction.productId._id);

      // Validate productID format

      const product = await Product_v2.findById(
        productID

      ).lean();
      if (!product || !product.status === "active") throw new Error("Sản phẩm không tồn tại");
      const nameProduct = product.product_name;
      const namImage = product.image
      // const testProductID = mongoose.Types.ObjectId("66e3eb3506aa43ec4bc5686b");

      const inven = await Inventory.findOne({ productAuction: productID, status: "active" }).lean();

      if (!inven) throw new Error("Sản phẩm trong kho không tồn tại");

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
      const updatedProductQuantity = inven.quantityShelf - quantityDetails;
      if (updatedProductQuantity < 0) {
        throw new Error("Số lượng sản phẩm không đủ");
      }

      const numInventoriesShelf = inven.quantityShelf;
      const numQuantityDetails = quantityDetails;
      const remainingQuantityShelf = numInventoriesShelf - numQuantityDetails;

      await Inventory.findOneAndUpdate(
        { productAuction: productID },

        {
          $set: {
            productAuction: productID,
            quantityShelf: remainingQuantityShelf,
            quantityStock: inven.quantityStock,
            totalQuantity: inven.totalQuantity,
            supplier: inven.supplier,
            price: inven.price,
            totalPrice: inven.totalPrice,
            status: "active",
            createdAt: Date.now(),
            updateAt: Date.now(),
          },
        }
      );

      // Send confirmation email to user
      const orderDetails = {
        name: nameProduct,

        productImage: namImage,
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



      if (!order) throw new Error("Đơn hàng không tồn tại");

      // Find order details related to the order
      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
      }).lean();


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
     
          const product = await Product_v2.findOne({ 
            _id: detail.productID,
            status: 'disable' // Điều kiện lọc, chỉ lấy sản phẩm không có trạng thái "disable"
          }).lean();
      
          
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
            productAuction: detail.productID,
            productID: null,

            OrderCart: null,
            Watchlist: null,
            Cart: null,
            item: null,
            type: "auctions",
            score: 6,
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

      // Gọi script Python để tạo gợi ý sản phẩm
      const userID = order.shippingAddress.userID.toString(); // Lấy userID dưới dạng chuỗi
      const pythonProcess = spawn('python', ['recommendation_service.py', userID]); // Gọi script Python với đối số là userID

      // Lắng nghe kết quả từ script Python
      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python Output: ${data.toString()}`);
        // Xử lý kết quả từ Python nếu cần
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data.toString()}`);
      });

      pythonProcess.on('close', (code) => {
        console.log(`Python script finished with code ${code}`);
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
  getAllOrders: async (page = 1, pageSize = 5, search) => {
    try {
      const orders = await OrderAuction.find({ status: "active" })
        .select("_id shippingAddress stateOrder  status")

        .lean();
      const orderMatch = orders.map(orders => {
        // Lấy thông tin sản phẩm từ productMap

        // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
        return {
          ...orders, // Thêm thông tin timeTrack
          // Thêm thông tin sản phẩm
        };

      }).filter(track => track !== null); // Lọc các phần tử null

      const allOrders = orderMatch.map(track => ({
        orderId: track._id,

      }));

      // In ra danh sách hình ảnh


      // Bước 6: Áp dụng tìm kiếm (nếu có)
      const searchResults = search
        ? orderMatch.filter((orderM) => {
          const phoneNumber = orderM.shippingAddress.phoneNumber
          return phoneNumber.includes(search);
        })
        : orderMatch;

      // Bước 7: Phân trang
      const totalItems = searchResults.length; // Tổng số mục sau khi lọc
      const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
      const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
      const paginatedResults = searchResults.slice((bucket - 1) * pageSize, bucket * pageSize); // Lấy dữ liệu của bucket

      // Bước 8: Tính toán tổng số trang
      const totalPages = totalBuckets;

      return {
        ordersDeleted: paginatedResults,
        totalPages: totalPages,
        currentPage: bucket,
        allOrders, // Trả về danh sách hình ảnh
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getDeletedOrders: async (page = 1, pageSize = 5, search) => {
    try {
      // Tính toán skip và limit dựa trên số trang và giới hạn (limit)
      const orders = await OrderAuction.find({ status: "disable" })
        .select("_id shippingAddress stateOrder status refundBank")

        .lean();

        console.log('orders', orders);
        
      const orderMatch = orders.map(orders => {
        // Lấy thông tin sản phẩm từ productMap

        // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
        return {
          ...orders, // Thêm thông tin timeTrack
          // Thêm thông tin sản phẩm
        };

      }).filter(track => track !== null); // Lọc các phần tử null

      const allOrders = orderMatch.map(track => ({
        orderId: track._id,

      }));

      // In ra danh sách hình ảnh


      // Bước 6: Áp dụng tìm kiếm (nếu có)
      const searchResults = search
        ? orderMatch.filter((orderM) => {
          const phoneNumber = orderM.shippingAddress.phoneNumber
          return phoneNumber.includes(search);
        })
        : orderMatch;

      // Bước 7: Phân trang
      const totalItems = searchResults.length; // Tổng số mục sau khi lọc
      const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
      const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
      const paginatedResults = searchResults.slice((bucket - 1) * pageSize, bucket * pageSize); // Lấy dữ liệu của bucket

      // Bước 8: Tính toán tổng số trang
      const totalPages = totalBuckets;

      return {
        ordersDeleted: paginatedResults,
        totalPages: totalPages,
        currentPage: bucket,
        allOrders, // Trả về danh sách hình ảnh
      };

    } catch (error) {
      throw new Error(`Error retrieving deleted orders: ${error.message}`);
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
