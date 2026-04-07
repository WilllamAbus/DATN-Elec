const Bidding = require('../../model/orders/bidding.model')
const CustomerService = require('../../model/customer-service/customer-service.model')
const socketService = require('../../services/serviceSocket');
const getUserAndService  = require('./findByID.service')
const sendDeletionConfirmationEmail = require('./sendDeletionConfirmMail.service')
const Notification = require('../../model/notification/notification.model')
const deleBidingService = {
    softDeleteBidding : async (biddingId) => {
        try {
            const nowUtc = new Date();
    
            // Chuyển đổi thời gian UTC về múi giờ Việt Nam
            // Múi giờ Việt Nam là UTC + 7 giờ
            const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
            const now = new Date(nowUtc.getTime() + offset);
              const result = await Bidding.findByIdAndUpdate(biddingId, { status: 'disable',  disabledAt: now }, { new: true });
          
            
              if (!result) {
                  throw new Error('Không thể cập nhật trạng thái của lượt đấu giá.');
              }
  
              return result;
        } catch (error) {
          throw new Error(`Error marking auction as deleted: ${error.message}`);
        }
      },

      logServiceRequest : async (userId, biddingId,serviceRequestId, reason, notes) => {
        try {
          const log = new CustomerService({
            bidding: biddingId,
            order:null,
            serviceRequest: serviceRequestId, // Sử dụng trường mới này
            reason:  reason,
            status: 'Mở',
            assignedAgent: userId,
            priority: 'Tham chiếu',
            notes: notes,
            modifieon: new Date(),
            stateNotifi: 'has',
            status: "active",
            disabledAt: null
          });
          
          await log.save();
        } catch (error) {
          throw new Error(`Error logging service request: ${error.message}`);
        }
      },
      handleAuctionDeletion: async (userId, biddingId,serviceRequestId, reason, notes) => {
        try {
          // Xóa đấu giá
          const auction = await deleBidingService.softDeleteBidding(biddingId);
         
            
          // Ghi nhận yêu cầu dịch vụ
          await deleBidingService.logServiceRequest(userId, biddingId, serviceRequestId, reason, notes);
          
          // Lấy thông tin người dùng và dịch vụ
          const userEmail = await getUserAndService.getUserEmailById(userId);
          const serviceDetails = await getUserAndService.getServiceDetailsById(serviceRequestId); // Dịch vụ có thể là đấu giá hoặc dịch vụ liên quan
          const customerRef = await CustomerService.findOne({
            assignedAgent:userId,
            status: { $ne: "disable" },
        }).lean()
    const customerSelect = {
        customerId: customerRef._id,
         customerReson:  customerRef.reason,
         cutomerNotes: customerRef.notes 
    }
          // Gửi email xác nhận hủy dịch vụ
          await sendDeletionConfirmationEmail(userEmail, serviceDetails, customerSelect);
          const notificationMessage = `Yêu cầu hủy dịch vụ của bạn đối với dịch vụ ${serviceDetails.name} đã được xử lý.`;
          const newNotification = new Notification({
            user: userId,
            message: notificationMessage,
            type: 'Thông tin',
            orders: null, // Thay đổi loại thông báo thành 'Thông tin'
            customer_service: serviceDetails._id, // Gán tham chiếu đến dịch vụ nếu cần
            isRead: true,
            modifieon: new Date(),
            stateNotifi: 'has',
            isActive: true,
            status: 'active'
          });

       
          
      
          await newNotification.save();
      
          // Gửi thông báo qua WebSocket bằng SocketService
          socketService.emitNotification({
            userId: userId,
            message: notificationMessage,
            type: 'Thông tin',
            isRead: true,
            timestamp: new Date()
          });
      
          return auction;
     
        } catch (error) {
          console.error(error)
          throw new Error(`Error handling auction deletion: ${error.message}`);
        }
      }
  
}

module.exports = deleBidingService