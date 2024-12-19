const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");

const Product_v2 = require("../../../model/productAuction/productAuction");
const User = require("../../../model/users.model");
const Inventory = require("../../../model/inventory/inventory.model");
const Vnpay = require("../../../model/orders/vnpay.model");
const iteractionOrderAucService = {
  getOrderByUser: async (userId) => {
    try {
        // Bước 1: Lấy danh sách đơn hàng dựa trên userId
        const orders = await OrderAuction.find({
        'shippingAddress.userID': userId,
          stateOrder: 'Chờ giao hàng', // Lọc theo trạng thái đơn hàng
          status: { $ne: "disable" }, // Loại bỏ đơn hàng bị vô hiệu hóa
        }) // Trả về dữ liệu JavaScript object thuần
        .sort({ createdAt: -1 }) // Sắp xếp theo thứ tự giảm dần (mới nhất lên trên)
        // Giới hạn số lượng đơn hàng (ví dụ: 10 đơn hàng gần nhất)
        .lean(); // Trả về dữ liệu JavaScript object thuần
        if (!orders.length) {
          return 'Không tìm thấy đơn hàng nào'
        }
    
        // Lấy danh sách orderIds từ orders
        const orderIds = orders.map(order => order._id);
    
        // Bước 2: Lấy chi tiết đơn hàng từ OrderDetailAuction dựa trên danh sách orderIds
        const orderDetails = await OrderDetailAuction.find({
          order: { $in: orderIds }, // Lọc theo danh sách orderIds
          status: { $ne: "disable" }, // Loại bỏ chi tiết đơn hàng bị vô hiệu hóa
        })   // Sắp xếp chi tiết đơn hàng theo thời gian cập nhật (mới nhất trước)
        .lean();
    
        if (!orderDetails.length) {
          return  "Không tìm thấy chi tiết đơn hàng  "
        }
    
        // Bước 3: Lấy thông tin chi tiết sản phẩm cho từng chi tiết đơn hàng
        const productIds = orderDetails.map(detail => detail.productID);

    // Bước 3: Lấy thông tin chi tiết sản phẩm cho từng chi tiết đơn hàng và sắp xếp theo thứ tự tên sản phẩm
    const products = await Product_v2.find({ _id: { $in: productIds } })
      .sort({ name: 1 }) // Sắp xếp sản phẩm theo tên (từ A đến Z)
      .lean();

    // Tạo một object để tra cứu nhanh thông tin sản phẩm
    const productMap = products.reduce((acc, product) => {
      acc[product._id] = product;
      return acc;
    }, {});

    // Bước 4: Cấu trúc lại dữ liệu trả về theo từng đơn hàng
    const finalOrderDetails = orders.map(order => {
      const productsInOrder = orderDetails
        .filter(detail => detail.order.equals(order._id)) // Lọc chi tiết đơn hàng theo orderId
        .map(detail => {
          const product = productMap[detail.productID];
          if (!product) return null; // Nếu không tìm thấy sản phẩm, bỏ qua

          return {
            productId: product._id,
            name: product.product_name || product.name,
            unit: product.unit,
            image: product.image,
            quantity: detail.quantityDetails,
            paymentMethod: detail.payment_method,
            shippingFee: detail.shippingFee,
            totalPrice: detail.totalPriceWithShipping,
          };
        })
        .filter(product => product !== null); // Lọc bỏ các chi tiết sản phẩm không hợp lệ (null)

      return {
        recipientName: order.shippingAddress.recipientName,
        phoneNumber: order.shippingAddress.phoneNumber,
        address: order.shippingAddress.address,
        email: order.shippingAddress.email,
        stateOrder: order.stateOrder,
        products: productsInOrder, // Chỉ lấy các sản phẩm thuộc về đơn hàng hiện tại
      };
    });

    return finalOrderDetails;
  
    } catch (error) {
      throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
    }
  },

  getPendingOrdersByUser: async (userId) => {
    try {
      // Tìm đơn hàng với userID tương ứng và không phải là "Nhận hàng"
 
      const orders = await OrderAuction.find({
        'shippingAddress.userID': userId,
        stateOrder: 'Chờ xử lý', // Lọc theo trạng thái đơn hàng
          status: { $ne: "disable" }, // Loại bỏ đơn hàng bị vô hiệu hóa
        }) // Trả về dữ liệu JavaScript object thuần
        .lean(); // Trả về dữ liệu JavaScript object thuần
   
        if (!orders) {
          return "Không tìm thấy đơn hàng nào "
        }
   
  
      // Cập nhật stateOrder thành "Vận chuyển"
      // await OrderAuction.findOneAndUpdate(
      //   { 
      //     _id: fineOrderAucForUser._id, 
      //     stateOrder: { $ne: "Vận chuyển" }, 
      //     status: { $ne: "disable" }
      //   },
      //   { $set: { stateOrder: "Vận chuyển" } }
      // );
  
      // Lấy các đơn hàng với stateOrder là "Vận chuyển" và không bị vô hiệu hóa
    // Sắp xếp theo thứ tự từ dưới lên (mới nhất lên trên)
   
      
      const orderIds = orders.map(order => order._id);
   
      
      // Lấy chi tiết các đơn hàng theo orderIds
      const orderDetails = await OrderDetailAuction.find({
        order: { $in: orderIds },
        status: { $ne: "disable" }
      }).lean();
  
      
      if (!orderDetails.length) {
        return    "Không tìm thấy chi tiết đơn hàng  "
      }
  
      // Lấy thông tin chi tiết sản phẩm cho từng chi tiết đơn hàng
      const productDetails = await Promise.all(
        orderDetails.map(async (detail) => {
          const product = await Product_v2.findById(detail.productID).lean();
          if (!product) return null;
  
          return {
            productId: product._id,
            name: product.product_name || product.name,
            unit: product.unit,
            image: product.image,
            quantity: detail.quantityDetails,
            paymentMethod: detail.payment_method,
            shippingFee: detail.shippingFee,
            totalPrice: detail.totalPriceWithShipping,
          };
        })
      );
  
      // Lọc bỏ các chi tiết sản phẩm không hợp lệ (null)
      const filteredProductDetails = productDetails.filter(detail => detail !== null);
  
      // Cấu trúc lại dữ liệu trả về theo từng đơn hàng
      const finalOrderDetails = orders.map(order => {
        return {
          orderId: order._id,
          userId: order.shippingAddress.userID,
          recipientName: order.shippingAddress.recipientName,
          phoneNumber: order.shippingAddress.phoneNumber,
          address: order.shippingAddress.address,
          userId: order.shippingAddress.userID,
          recipientName: order.shippingAddress.recipientName,
          phoneNumber: order.shippingAddress.phoneNumber,
          address: order.shippingAddress.address,
          email: order.shippingAddress.email,
          stateOrder: order.stateOrder,
          products: filteredProductDetails.filter(detail => {
            return orderDetails.some(od => od.order.equals(order._id) && od.productID.equals(detail.productId));
          }),
        };
      });
  
      return finalOrderDetails;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
    }
  },

  getConfirmedOrdersByUser: async (userId) => {
    try {
      // Tìm đơn hàng với userID tương ứng và không phải là "Nhận hàng"
 
      const orders = await OrderAuction.find({
        'shippingAddress.userID': userId,
        stateOrder: 'Đã xác nhận', // Lọc theo trạng thái đơn hàng
          status: { $ne: "disable" }, // Loại bỏ đơn hàng bị vô hiệu hóa
        }) // Trả về dữ liệu JavaScript object thuần
        .lean(); // Trả về dữ liệu JavaScript object thuần
   
        if (!orders) {
          return   "Không tìm thấy đơn hàng nào "
        }
   
  
      // Cập nhật stateOrder thành "Vận chuyển"
      // await OrderAuction.findOneAndUpdate(
      //   { 
      //     _id: fineOrderAucForUser._id, 
      //     stateOrder: { $ne: "Vận chuyển" }, 
      //     status: { $ne: "disable" }
      //   },
      //   { $set: { stateOrder: "Vận chuyển" } }
      // );
  
      // Lấy các đơn hàng với stateOrder là "Vận chuyển" và không bị vô hiệu hóa
    // Sắp xếp theo thứ tự từ dưới lên (mới nhất lên trên)
   
      
      const orderIds = orders.map(order => order._id);
   
      
      // Lấy chi tiết các đơn hàng theo orderIds
      const orderDetails = await OrderDetailAuction.find({
        order: { $in: orderIds },
        status: { $ne: "disable" }
      }).lean();
  
      
      if (!orderDetails.length) {
        return   "Không tìm thấy chi tiết đơn hàng  "
      }
  
      // Lấy thông tin chi tiết sản phẩm cho từng chi tiết đơn hàng
      const productDetails = await Promise.all(
        orderDetails.map(async (detail) => {
          const product = await Product_v2.findById(detail.productID).lean();
          if (!product) return null;
  
          return {
            productId: product._id,
            name: product.product_name || product.name,
            unit: product.unit,
            image: product.image,
            quantity: detail.quantityDetails,
            paymentMethod: detail.payment_method,
            shippingFee: detail.shippingFee,
            totalPrice: detail.totalPriceWithShipping,
          };
        })
      );
  
      // Lọc bỏ các chi tiết sản phẩm không hợp lệ (null)
      const filteredProductDetails = productDetails.filter(detail => detail !== null);
  
      // Cấu trúc lại dữ liệu trả về theo từng đơn hàng
      const finalOrderDetails = orders.map(order => {
        return {
          orderId: order._id,
          userId: order.shippingAddress.userID,
          recipientName: order.shippingAddress.recipientName,
          phoneNumber: order.shippingAddress.phoneNumber,
          address: order.shippingAddress.address,
          userId: order.shippingAddress.userID,
          recipientName: order.shippingAddress.recipientName,
          phoneNumber: order.shippingAddress.phoneNumber,
          address: order.shippingAddress.address,
          email: order.shippingAddress.email,
          stateOrder: order.stateOrder,
          products: filteredProductDetails.filter(detail => {
            return orderDetails.some(od => od.order.equals(order._id) && od.productID.equals(detail.productId));
          }),
        };
      });
  
      return finalOrderDetails;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
    }
  },
  getShippingOrdersByUser: async (userId) => {
    try {
      // Tìm đơn hàng với userID tương ứng và không phải là "Nhận hàng"
 
      const orders = await OrderAuction.find({
        'shippingAddress.userID': userId,
        stateOrder: 'Vận chuyển', // Lọc theo trạng thái đơn hàng
          status: { $ne: "disable" }, // Loại bỏ đơn hàng bị vô hiệu hóa
        }) // Trả về dữ liệu JavaScript object thuần
        .lean(); // Trả về dữ liệu JavaScript object thuần
   
        if (!orders) {
          return   "Không tìm thấy  đơn hàng  "
        }
   
  
      // Cập nhật stateOrder thành "Vận chuyển"
      // await OrderAuction.findOneAndUpdate(
      //   { 
      //     _id: fineOrderAucForUser._id, 
      //     stateOrder: { $ne: "Vận chuyển" }, 
      //     status: { $ne: "disable" }
      //   },
      //   { $set: { stateOrder: "Vận chuyển" } }
      // );
  
      // Lấy các đơn hàng với stateOrder là "Vận chuyển" và không bị vô hiệu hóa
    // Sắp xếp theo thứ tự từ dưới lên (mới nhất lên trên)
   
      
      const orderIds = orders.map(order => order._id);

      
      // Lấy chi tiết các đơn hàng theo orderIds
      const orderDetails = await OrderDetailAuction.find({
        order: { $in: orderIds },
        status: { $ne: "disable" }
      }).lean();
  
      
      if (!orderDetails.length) {
        return   "Không tìm thấy chi tiết đơn hàng  ";
      }
  
      // Lấy thông tin chi tiết sản phẩm cho từng chi tiết đơn hàng
      const productDetails = await Promise.all(
        orderDetails.map(async (detail) => {
          const product = await Product_v2.findById(detail.productID).lean();
          if (!product) return null;
  
          return {
            productId: product._id,
            name: product.product_name || product.name,
            unit: product.unit,
            image: product.image,
            quantity: detail.quantityDetails,
            paymentMethod: detail.payment_method,
            shippingFee: detail.shippingFee,
            totalPrice: detail.totalPriceWithShipping,
          };
        })
      );
  
      // Lọc bỏ các chi tiết sản phẩm không hợp lệ (null)
      const filteredProductDetails = productDetails.filter(detail => detail !== null);
  
      // Cấu trúc lại dữ liệu trả về theo từng đơn hàng
      const finalOrderDetails = orders.map(order => {
        return {
          orderId: order._id,
          userId: order.shippingAddress.userID,
          recipientName: order.shippingAddress.recipientName,
          phoneNumber: order.shippingAddress.phoneNumber,
          address: order.shippingAddress.address,
          userId: order.shippingAddress.userID,
          recipientName: order.shippingAddress.recipientName,
          phoneNumber: order.shippingAddress.phoneNumber,
          address: order.shippingAddress.address,
          email: order.shippingAddress.email,
          stateOrder: order.stateOrder,
          products: filteredProductDetails.filter(detail => {
            return orderDetails.some(od => od.order.equals(order._id) && od.productID.equals(detail.productId));
          }),
        };
      });
  
      return finalOrderDetails;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
    }
  },
  


      getReciveOrdersByUser: async (userId) => {
        try {
      

        
          
          // Tìm các đơn hàng với userID tương ứng và không phải là "Nhận hàng"
          //  await OrderAuction.findOneAndUpdate(
          //   {
          
          //     _id: fineOrderAucForUser._id,
          //   stateOrder: "Vận chuyển",
          //   // stateOrder: { $ne: "Nhận hàng" },
          //   status: { $ne: "disable" },
          
          // },
          //    {$set:{ stateOrder: "Nhận hàng" } }).exec();

             const orders = await OrderAuction.find({
              'shippingAddress.userID': userId,
              stateOrder: 'Nhận hàng',
              status: { $ne: "disable" },
             })
             if (!orders) {
              return "Không tìm thấy  đơn hàng  "
            }
             const orderIds = orders.map(order => order._id);
      
             
             const orderDetails = await OrderDetailAuction.find({
               order: { $in: orderIds }, // Lọc theo danh sách orderIds
               status: { $ne: "disable" }, // Loại bỏ chi tiết đơn hàng bị vô hiệu hóa
             }).lean();
             
            
             
             if (!orderDetails.length) {
              return  "Không tìm thấy chi tiết đơn hàng  "
             }
         
             // Bước 3: Lấy thông tin chi tiết sản phẩm cho từng chi tiết đơn hàng
             const productDetails = await Promise.all(
               orderDetails.map(async (detail) => {
                 // Tìm kiếm thông tin sản phẩm từ Product_v2 theo productID
                 const product = await Product_v2.findById(detail.productID).sort({ name: 1 }).lean();
         
                 if (!product) {
                   // Nếu sản phẩm không tìm thấy, bỏ qua phần chi tiết này
                   return null;
                 }
         
                 return {
                   productId: product._id, // ID của sản phẩm
                   name: product.product_name || product.name, // Tên sản phẩm
                   unit: product.unit, // Đơn vị sản phẩm
                   image: product.image, // Hình ảnh sản phẩm
                   quantity: detail.quantityDetails, // Số lượng
                   paymentMethod: detail.payment_method,
                   shippingFee: detail.shippingFee, // Phương thức thanh toán
                   totalPrice: detail.totalPriceWithShipping, // Tổng tiền bao gồm phí vận chuyển
                 };
               })
             );
         
             // Lọc bỏ các chi tiết sản phẩm không hợp lệ (null)
             const filteredProductDetails = productDetails.filter(detail => detail !== null);
         
             // Bước 4: Cấu trúc lại dữ liệu trả về theo từng đơn hàng
             const finalOrderDetails = orders.map(order => {
               return {
                 recipientName: order.shippingAddress.recipientName,
                 phoneNumber: order.shippingAddress.phoneNumber,
                 address: order.shippingAddress.address,
                 email: order.shippingAddress.email,
                 stateOrder: order.stateOrder,
                 products: filteredProductDetails.filter(detail => {
                   return orderDetails.some(od => od.order.equals(order._id) && od.productID.equals(detail.productId));
                 }), // Chỉ lấy các sản phẩm thuộc về đơn hàng hiện tại
               };
             });
         
             return finalOrderDetails;
       
        } catch (error) {
          throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
        }
      },

      getCompleteOrdersByUser: async (userId) => {
        try {
      
          // Tìm các đơn hàng với userID tương ứng và không phải là "Nhận hàng"
          //  await OrderAuction.findOneAndUpdate(
          //   {
          
          //     _id: fineOrderAucForUser._id,
          //   stateOrder: "Nhận hàng",
          //   // stateOrder: { $ne: "Nhận hàng" },
          //   status: { $ne: "disable" },
          
          // },
          //    {$set:{ stateOrder: "Hoàn tất" } }).exec();
             const orders = await OrderAuction.find({
              'shippingAddress.userID': userId,
              stateOrder: 'Hoàn tất',
              status: { $ne: "disable" },
             }).lean()
             if (!orders) {
              return   "Không tìm thấy  đơn hàng  "
            }
             const orderIds = orders.map(order => order._id);
      
             
             const orderDetails = await OrderDetailAuction.find({
               order: { $in: orderIds }, // Lọc theo danh sách orderIds
               status: { $ne: "disable" }, // Loại bỏ chi tiết đơn hàng bị vô hiệu hóa
             }).lean();
             
            
             
             if (!orderDetails.length) {
              return   "Không tìm thấy chi tiết đơn hàng  ";
             }
         
             // Bước 3: Lấy thông tin chi tiết sản phẩm cho từng chi tiết đơn hàng
             const productDetails = await Promise.all(
               orderDetails.map(async (detail) => {
                 // Tìm kiếm thông tin sản phẩm từ Product_v2 theo productID
                 const product = await Product_v2.findById(detail.productID).sort({ name: 1 }).lean();
         
                 if (!product) {
                   // Nếu sản phẩm không tìm thấy, bỏ qua phần chi tiết này
                   return null;
                 }
         
                 return {
                   productId: product._id, // ID của sản phẩm
                   name: product.product_name || product.name, // Tên sản phẩm
                   unit: product.unit, // Đơn vị sản phẩm
                   image: product.image, // Hình ảnh sản phẩm
                   quantity: detail.quantityDetails, // Số lượng
                   paymentMethod: detail.payment_method,
                   shippingFee: detail.shippingFee, // Phương thức thanh toán
                   totalPrice: detail.totalPriceWithShipping, // Tổng tiền bao gồm phí vận chuyển
                 };
               })
             );
         
             // Lọc bỏ các chi tiết sản phẩm không hợp lệ (null)
             const filteredProductDetails = productDetails.filter(detail => detail !== null);
         
             // Bước 4: Cấu trúc lại dữ liệu trả về theo từng đơn hàng
             const finalOrderDetails = orders.map(order => {
               return {
                 recipientName: order.shippingAddress.recipientName,
                 phoneNumber: order.shippingAddress.phoneNumber,
                 address: order.shippingAddress.address,
                 email: order.shippingAddress.email,
                 stateOrder: order.stateOrder,
                 products: filteredProductDetails.filter(detail => {
                   return orderDetails.some(od => od.order.equals(order._id) && od.productID.equals(detail.productId));
                 }), // Chỉ lấy các sản phẩm thuộc về đơn hàng hiện tại
               };
             });
         
             return finalOrderDetails;
    
       
        } catch (error) {
          throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
        }
      },

      softDeleteReceivedOrdersByUser: async (orderId) => {
        try {
          const nowUtc = new Date();
          const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
          const now = new Date(nowUtc.getTime() + offset);
      
          // Tìm và xóa mềm các đơn hàng có stateOrder là "Nhận hàng"
          const orderToUpdate = await OrderAuction.findOne({
            _id: orderId,
            status: { $ne: "disable" },
          }).exec();
       
      
          if (!orderToUpdate) {
            return "Không tìm thấy đơn hàng";
          }
       
    
          
          const orderIds = orderToUpdate._id;
       
      
          const orderDetailST = await OrderDetailAuction.find({ order: orderIds }).lean();
    
      
          const orderPayment = orderDetailST[0].payment_method;
   
      
          if (
            orderToUpdate.stateOrder !== "Chờ xử lý" &&
            orderToUpdate.stateOrder !== "Đã xác nhận"
          ) {
            return "Đơn hàng không thể hủy. Chỉ các đơn hàng có trạng thái 'Chờ xử lý' hoặc 'Xác nhận đơn hàng' mới có thể hủy.";
          }
       
          
          // Xử lý xóa mềm bất kể phương thức thanh toán
          const vnPay = await Vnpay.find({transaction_status: '00'})
       
          .lean()
      
              
          if (!vnPay) {
            return "Không tìm thấy ngân hàng ";
          }
      
     
    
      
          const filteredVnPay = vnPay.filter(payment => {
            return !payment.order_info.includes("Thanh toan");
          });
          
        
       
          const lastIndex = filteredVnPay.length - 1;
          const lastElement = filteredVnPay[lastIndex];
      
          const OrderInForPayment = lastElement.order_info
      
          
          const transOrderId = orderIds.toString();
          let inforBank
          let banksInfo =  OrderInForPayment === transOrderId ? inforBank = {
            bankCode: lastElement.bank_code,
            orderInForVnPay: orderIds,
            paymentDateVnPay: lastElement.payment_date,
            transiTionAmout: lastElement.amount,
          } : null

      
          await OrderAuction.findOneAndUpdate(
            { _id: orderIds },
            {
              $set: {
                status: "disable",
                disabledAt: now,
                stateOrder: "Hủy đơn hàng",
           
                ...(orderPayment !== "Thanh toán trực tiếp" && { refundBank: banksInfo }),
              },
            },
            { new: true }
          ).exec();
      
          const orderDetail = await OrderDetailAuction.find({ order: orderIds }).lean();
     
      
          const inven = orderDetail[0].productID;
          const inventories = await Inventory.findOne({
            productAuction: inven,
          }).lean();
      
          const invenSheld = inventories.quantityShelf + 1;
      
          await Inventory.findOneAndUpdate(
            {
              productAuction: inven,
            },
            {
              $set: {
                quantityShelf: invenSheld,
              },
            }
          ).exec();
      
          const orders = await OrderAuction.findOne({
            _id: orderIds,
            status: "disable",
            stateOrder: "Hủy đơn hàng",
          })
            .populate("shippingAddress.userID")
            .exec();
        
      
          return { updateOrder: orders };
        } catch (error) {
          console.error("Error:", error);
          throw new Error(`Lỗi khi xóa mềm đơn hàng: ${error.message}`);
        }
      },
      

      updateOrderStatus: async (orderId, stateOrder) => {
        try {
          const statusOrderFlow = [
            "Chờ giao hàng",
            "Chờ xử lý",
            "Đã xác nhận",
            "Vận chuyển",
            "Nhận hàng",
            "Hoàn tất",
            "Giao hàng không thành công",
          ];
      
          const order = await OrderAuction.findById(orderId);
      
          if (!order) {
            throw new Error("Đơn hàng không tồn tại.");
          }
      
          const currentIndex = statusOrderFlow.indexOf(order.stateOrder);
          const newIndex = statusOrderFlow.indexOf(stateOrder);
      
          if (currentIndex === -1 || newIndex === -1) {
            throw new Error("Trạng thái hiện tại hoặc trạng thái mới không hợp lệ.");
          }
      
          if (order.stateOrder === "Hoàn tất") {
            return { message: "Đơn hàng đã 'Hoàn tất' và không thể chuyển sang trạng thái khác." };
          }
      
          if (stateOrder === "Giao hàng không thành công" ) {
            // Xử lý chuyển trạng thái đặc biệt
            const orderDetail = await OrderDetailAuction.find({ order: orderId }).lean();
            if (!orderDetail.length) {
              throw new Error("Không tìm thấy chi tiết đơn hàng.");
            }
      
            const productId = orderDetail[0].productID;
            const orderPayment = orderDetail[0].payment_method;
            const inventory = await Inventory.findOne({ productAuction: productId });
            if (!inventory) {
              throw new Error("Không tìm thấy thông tin tồn kho.");
            }
      
            // Cập nhật tồn kho
            await Inventory.findOneAndUpdate(
              { productAuction: productId },
              { $inc: { quantityShelf: 1 } }
            ).exec();
      
            // Cập nhật trạng thái đơn hàng
            const updatedOrder = await OrderAuction.findOneAndUpdate(
              { _id: orderId },
              { $set: { stateOrder } },
              { new: true, runValidators: true }
            );
            const orderIds = updatedOrder._id;
            const vnPay = await Vnpay.find({transaction_status: '00'})
       
            .lean()
        
                
            if (!vnPay) {
              return "Không tìm thấy ngân hàng ";
            }
        
       
      
        
            const filteredVnPay = vnPay.filter(payment => {
              return !payment.order_info.includes("Thanh toan");
            });
            
          
         
            const lastIndex = filteredVnPay.length - 1;
            const lastElement = filteredVnPay[lastIndex];
        
            const OrderInForPayment = lastElement.order_info
        
            
            const transOrderId = orderIds.toString();
            let inforBank
            let banksInfo =  OrderInForPayment === transOrderId ? inforBank = {
              bankCode: lastElement.bank_code,
              orderInForVnPay: orderIds,
              paymentDateVnPay: lastElement.payment_date,
              transiTionAmout: lastElement.amount,
            } : null
  
        
           const refundBanl =  await OrderAuction.findOneAndUpdate(
              { _id: orderIds },
              {
                $set: {
                
                  ...(orderPayment !== "Thanh toán trực tiếp" && { refundBank: banksInfo }),
                },
              },
              { new: true }


            ).exec();

            const orderDerCheck = refundBanl.refundBank.bankCode;
      
            if (orderDerCheck === 'NCB') {
              await OrderAuction.findOneAndUpdate(
                { _id: orderIds },
                {
                  $set: {
                    status: "disable",
                 
                    stateOrder: "Hoàn tiền",
               
                  
                  },
                },
                { new: true }
              ).exec();
              // Thực hiện các logic cần thiết với orderDerCheck
            } else {
              await OrderAuction.findOneAndUpdate(
                { _id: orderIds },
                {
                  $set: {
                    status: "disable",
                 
                    stateOrder: "Giao hàng không thành công",
               
                  
                  },
                },
                { new: true }
              ).exec();
            }

            return {
              order: updatedOrder,
              message: "Cập nhật trạng thái đơn hàng thành công: Giao hàng không thành công.",
            };
          }
      
          if (newIndex === currentIndex + 1) {
            // Chuyển trạng thái tiếp theo
            const updatedOrder = await OrderAuction.findOneAndUpdate(
              { _id: orderId },
              { $set: { stateOrder } },
              { new: true, runValidators: true }
            );
      
            return {
              order: updatedOrder,
              message: `Cập nhật trạng thái đơn hàng thành công: ${stateOrder}`,
            };
          } else {
            throw new Error("Không thể chuyển về trạng thái trước đó hoặc nhảy qua trạng thái.");
          }
        } catch (error) {
          console.error("Error updating order status:", error.message || "Lỗi cập nhật trạng thái đơn hàng.");
          throw new Error(error.message || "Lỗi cập nhật trạng thái đơn hàng.");
        }
      },
      



      updateOrderStatusRefunCash : async (orderIdCash, stateOrderCash) => {
        try {
          const statusOrderFlowCash = [  "Hoàn tiền", "Chờ xử lý hoàn tiền", "Đã xác nhận hoàn tiền", "Hoàn tiền thành công"];
        
          // Tìm đơn hàng
          const orderCash = await OrderAuction.findById(orderIdCash);

        
          if (!orderCash ) {
            throw new Error("Đơn hàng không tồn tại ");
          }
        
          // Kiểm tra trạng thái hiện tại
          const currentIndexCash = statusOrderFlowCash.indexOf(orderCash.stateOrder);
          const newIndexCash = statusOrderFlowCash.indexOf(stateOrderCash);
        
          // Nếu trạng thái hiện tại hoặc trạng thái mới không hợp lệ
          if (currentIndexCash === -1 || newIndexCash === -1) {
            throw new Error("Trạng thái hiện tại hoặc trạng thái mới không hợp lệ.");
          }
        
          // Ngăn cản cập nhật khi đơn hàng đã "Hoàn tất"
          if (orderCash.stateOrder === "Hoàn tiền thành công") {
            return { message: "Đơn hàng đã 'Hoàn tiền thành công' và không thể chuyển sang trạng thái khác." };
          }
        
          // Ràng buộc chỉ có thể chuyển tới trạng thái tiếp theo
          if (newIndexCash > currentIndexCash && newIndexCash === currentIndexCash + 1) {
            const updatedOrderCash = await OrderAuction.findOneAndUpdate(
              { _id: orderIdCash },
              { $set: { stateOrder: stateOrderCash } },
              { new: true, runValidators: true }
            );
        
  
            return { orderCash: updatedOrderCash, message: `Cập nhật trạng thái đơn hàng thành công: ${stateOrderCash}` };
          } else {
            console.error("Trạng thái không hợp lệ. Current status:", orderCash.stateOrder, "New status:", stateOrderCash);
            throw new Error("Không thể chuyển về trạng thái trước đó hoặc nhảy qua trạng thái.");
          }
        } catch (error) {
          console.error("Error updating order status:", error.message || "Lỗi cập nhật trạng thái đơn hàng.");
          throw new Error(error.message || "Lỗi cập nhật trạng thái đơn hàng.");
        }
        


      

      }


}

module.exports = iteractionOrderAucService