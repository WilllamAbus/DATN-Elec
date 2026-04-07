const OrderAuction = require("../../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../../model/orders/auctionsOrders/aucOrderDetail.model");
const Inventory = require("../../../../model/inventory/inventory.model");
const getUserAndService = require("./findByIdSoftDel");
const sendDeletionConfirmationEmail = require("./mailForOrderItarac");
const Product_v2 = require("../../../../model/productAuction/productAuction");
const CustomerService = require("../../../../model/customer-service/customer-service.model");
const User = require("../../../../model/users.model");
const Vnpay = require("../../../../model/orders/vnpay.model");
const deleOrderIterationUser = {
  softDeleteOrdersByUser: async (orderId) => {
    try {
      const nowUtc = new Date();
      const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
      const now = new Date(nowUtc.getTime() + offset);

      // Tìm và xóa mềm các đơn hàng có stateOrder là "Nhận hàng"
      const orderToUpdate = await OrderAuction.findOne({
        _id: orderId,

        status: { $ne: "disable" },
      }).exec();

      const orderIds = orderToUpdate._id;
      if (!orderToUpdate) {
        return "Không tìm thấy đơn hàng";
      }
      const orderDetail = await OrderDetailAuction.findOne({
        order: orderIds,
        status: "active", // Thay "yourStatusValue" bằng giá trị status bạn muốn lọc
      }).lean();
      const orderPayment = orderDetail.payment_method;
      if (
        orderToUpdate.stateOrder !== "Chờ xử lý" &&
        orderToUpdate.stateOrder !== "Đã xác nhận"
      ) {
        return "Đơn hàng không thể hủy. Chỉ các đơn hàng có trạng thái 'Chờ xử lý' hoặc 'Xác nhận đơn hàng' mới có thể hủy..";
      }

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
        { _id: orderIds }, // Query by the unique _id of the document
        {
          $set: {
            status: "disable",
            disabledAt: now,
            stateOrder: "Hoàn tiền",
            ...(orderPayment !== "Thanh toán trực tiếp" && { refundBank: banksInfo }),
          },
        },
    
        { new: true } // Optionally, return the updated document
      ).exec();

 

      
      const inven = orderDetail.productID;

      
      const inventories = await Inventory.findOne({
        productAuction: inven,
        status: "active",
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
      await OrderDetailAuction.findOneAndUpdate(
        {
          order: orderIds,
          status: "active",
        },
        {
          $set: {
            status: "disable",
            disabledAt: now,
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

  logServiceRequest: async (
    userId,
    orderId,
    serviceRequestId,
    reason,
    notes
  ) => {
    try {
      const log = new CustomerService({
        bidding: null,
        order: orderId,
        serviceRequest: serviceRequestId, // Sử dụng trường mới này
        reason: reason,
        status: "Mở",
        assignedAgent: userId,
        priority: "Tham chiếu",
        notes: notes,
        modifieon: new Date(),
        stateNotifi: "has",
        status: "active",
        disabledAt: null,
      });

      await log.save();
    } catch (error) {
      throw new Error(`Error logging service request: ${error.message}`);
    }
  },
  handleAuctionDeletion: async (
    userId,
    orderId,
    serviceRequestId,
    reason,
    notes
  ) => {
    try {
      // Xóa đấu giá
      const auction = await deleOrderIterationUser.softDeleteOrdersByUser(
        orderId
      );

      // Ghi nhận yêu cầu dịch vụ
      await deleOrderIterationUser.logServiceRequest(
        userId,
        orderId,
        serviceRequestId,
        reason,
        notes
      );

      // Lấy thông tin người dùng và dịch vụ
      const userEmail = await getUserAndService.getUserEmailById(userId);
      const serviceDetails = await getUserAndService.getServiceDetailsById(
        serviceRequestId
      ); // Dịch vụ có thể là đấu giá hoặc dịch vụ liên quan
      const customerRef = await CustomerService.findOne({
        order: orderId,
        status: { $ne: "disable" },
      }).lean();
    
      const serviceOrder = customerRef.order

      const orderDetails = await OrderDetailAuction.findOne({
        order: serviceOrder,
      }).lean();

      
      if (!orderDetails) {
        throw new Error("Order details not found");
      }
  
      // Truy xuất thông tin sản phẩm từ product_v2
      const product = await Product_v2.findOne({ _id: orderDetails.productID })
        .select("product_name image")
        .lean();
  
      if (!product) {
        throw new Error("Product not found");
      }
  
      const customerSelect = {
        serviceOrder,
        customerId: customerRef._id,
        customerReason: customerRef.reason,
        customerNotes: customerRef.notes,
        productName: product.product_name,
        productImage: product.image[0],
      };
  
      
      
      // Gửi email xác nhận hủy dịch vụ
      await sendDeletionConfirmationEmail(
        userEmail,
        serviceDetails,
        customerSelect
      );

      return auction;
    } catch (error) {
      console.error(error);
      throw new Error(`Error handling auction deletion: ${error.message}`);
    }
  },
};

module.exports = deleOrderIterationUser;
