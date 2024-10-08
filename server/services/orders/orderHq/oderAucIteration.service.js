const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");

const Product_v2 = require("../../../model/product_v2");

const Inventory = require("../../../model/inventory/inventory.model");
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
          throw new Error('Không tìm thấy đơn hàng nào.');
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
          throw new Error('Không tìm thấy chi tiết đơn hàng nào.');
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
          throw new Error('Không tìm thấy đơn hàng nào.');
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
      console.log('orderIds', orderIds);
      
      // Lấy chi tiết các đơn hàng theo orderIds
      const orderDetails = await OrderDetailAuction.find({
        order: { $in: orderIds },
        status: { $ne: "disable" }
      }).lean();
  
      
      if (!orderDetails.length) {
        throw new Error('Không tìm thấy chi tiết đơn hàng nào.');
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
          
             const orderIds = orders.map(order => order._id);
      
             
             const orderDetails = await OrderDetailAuction.find({
               order: { $in: orderIds }, // Lọc theo danh sách orderIds
               status: { $ne: "disable" }, // Loại bỏ chi tiết đơn hàng bị vô hiệu hóa
             }).lean();
             
            
             
             if (!orderDetails.length) {
               throw new Error('Không tìm thấy chi tiết đơn hàng nào.');
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
          
             const orderIds = orders.map(order => order._id);
      
             
             const orderDetails = await OrderDetailAuction.find({
               order: { $in: orderIds }, // Lọc theo danh sách orderIds
               status: { $ne: "disable" }, // Loại bỏ chi tiết đơn hàng bị vô hiệu hóa
             }).lean();
             
            
             
             if (!orderDetails.length) {
               throw new Error('Không tìm thấy chi tiết đơn hàng nào.');
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

      softDeleteReceivedOrdersByUser: async (orderId, userId) => {
        try {
          const nowUtc = new Date();
          const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
          const now = new Date(nowUtc.getTime() + offset);
    
          // Tìm và xóa mềm các đơn hàng có stateOrder là "Nhận hàng"
          const orderToUpdate = await OrderAuction.findOne({
           _id: orderId,
       
            stateOrder: "Vận chuyển",
            status: { $ne: "disable" },
          }).exec();
       
          
          
          const orderIds = orderToUpdate._id
  
    
          
        
        await OrderAuction.updateOne(
            { _id: orderIds }, // Query by the unique _id of the document
            { 
              $set: { 
                status: "disable", 
                disabledAt: now, 
                stateOrder: "Hủy đơn hàng" 
              } 
            },
            { new: true } // Optionally, return the updated document
          ).exec();
       
          
            const orderDetail = await OrderDetailAuction.find({order:orderIds}).lean()
            const inven  = orderDetail[0].productID
            const inventories =  await Inventory.findOne({product: inven}).lean();
      
            const invenSheld = inventories.quantityShelf + 1

          await Inventory.findOneAndUpdate(
              {
                product:inven
            },
           {$set:{
         
            quantityShelf: invenSheld,
      
        
            

           }}
          ).exec()
          
          const orders = await OrderAuction.findOne({
            _id: orderIds,
            status: "disable",
            stateOrder: "Hủy đơn hàng",
          })
            .populate("shippingAddress.userID")
          
         
            .exec();

    
          return {updateOrder : orders}
        } catch (error) {
          console.error("Error:", error);
          throw new Error(`Lỗi khi xóa mềm đơn hàng: ${error.message}`);
        }
      },

      updateOrderStatus : async (orderId, stateOrder) => {
        try {
          console.log('orderStatus', stateOrder);
          console.log('orderId', orderId);
          
          const statusOrderFlow = ["Vận chuyển", "Nhận hàng", "Hoàn tất", "Hủy đơn hàng"];
          
          // Tìm đơn hàng
          const order = await OrderAuction.findById(orderId);
          if (!order) {
            console.error("Đơn hàng không tồn tại", orderId);
            throw new Error("Đơn hàng không tồn tại");
          }
          console.log('Order found:', order);
          console.log('State', order.stateOrder);
          
          
          // Nếu trạng thái hiện tại là "Hủy đơn hàng", không thể cập nhật nữa
          if (order.stateOrder === "Hủy đơn hàng") {
            console.warn("Đơn hàng đã bị hủy, không thể thay đổi trạng thái:", orderId);
            throw new Error("Đơn hàng đã bị hủy, không thể thay đổi trạng thái.");
          }
       
          if (
            stateOrder === "Hoàn tất" &&
            (order.stateOrder === "Chờ giao hàng" || order.stateOrder === "Nhận hàng")
          ) {
            return res.status(400).json({
              message:
                "Đơn hàng không thể chuyển từ trạng thái 'Chờ giao hàng' hoặc 'Đã xác nhận' sang trạng thái 'Nhận hàng'.",
            });
          }
          if (order.stateOrder === "Hủy đơn hàng") {
            return res.status(400).json({
              message: "Đơn hàng đã bị hủy và không thể cập nhật trạng thái khác.",
            });
          }
    
          if (
            order.stateOrder === "Đang vận chuyển" &&
            (stateOrder === "Chờ giao hàng" || stateOrder === "Hoàn tất")
          ) {
            return res.status(400).json({
              message:
                "Đơn hàng đang vận chuyển không thể chuyển về trạng thái 'Chờ giao hàng' hoặc 'Hoàn tất'.",
            });
          }
          if (
            order.stateOrder === "Nhận hàng" &&
            stateOrder === "Đang vận chuyển"
          ) {
            return res.status(400).json({
              message:
                "Đơn hàng ở trạng thái 'Nhận hàng' không thể chuyển sang trạng thái 'Đang vận chuyển'.",
            });
          }
          console.log('Incoming orderId:', orderId);
          console.log('Incoming newStatus:', stateOrder);
          // Kiểm tra trạng thái mới có hợp lệ không
          const currentIndex = statusOrderFlow.indexOf(order.stateOrder);
          const newIndex = statusOrderFlow.indexOf(stateOrder);
          
          console.log(`Current status index: ${currentIndex}, New status index: ${newIndex}`);
          console.log(`Current status: ${order.stateOrder}, New status: ${stateOrder}`);
          
          // Nếu trạng thái mới là "Hủy đơn hàng" hoặc là trạng thái tiếp theo hợp lệ
          if (newIndex === statusOrderFlow.length - 1 || newIndex === currentIndex + 1) {
            const updatedOrder = await OrderAuction.findOneAndUpdate(
              { _id: orderId },
              { $set: { stateOrder: stateOrder } }, // Use $set to specify the field to update
              { new: true, runValidators: true } // Options: return updated doc, run validation
            );
        
            console.log('Updated order:', updatedOrder);
            return { order: updatedOrder, message: `Cập nhật trạng thái đơn hàng thành công: ${stateOrder}` };
          } else {
            console.error("Trạng thái không hợp lệ. Current status:", order.stateOrder, "New status:", stateOrder);
            throw new Error("Trạng thái không hợp lệ.");
          }
        } catch (error) {
          console.error("Error updating order status:", error.message || "Lỗi cập nhật trạng thái đơn hàng.");
          throw new Error(error.message || "Lỗi cập nhật trạng thái đơn hàng.");
        }
        


      

      }


}

module.exports = iteractionOrderAucService