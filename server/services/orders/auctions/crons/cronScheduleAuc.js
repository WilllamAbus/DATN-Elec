
const Auction = require('../../../../model/orders/auction.model'); // Đảm bảo đúng đường dẫn đến model Auction

// Tác vụ cron chạy mỗi phút


const scheduelAuction = {
  updatedAuction: async ()=>{
    try {
      const now = new Date();
   
      
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 giờ trước
  
      // Tìm tất cả các đấu giá có `createdAt` cũ hơn 24 giờ và có status là active
      const expiredAuctions = await Auction.find({
        createdAt: { $lt: twentyFourHoursAgo }, // Dựa vào createdAt
        status: 'active'
      });
  
      // Cập nhật trạng thái cho từng đấu giá dựa theo productId
      for (const auction of expiredAuctions) {
        const updatedAuction = await Auction.findOneAndUpdate(
          { productId: auction.productId }, // Điều kiện tìm kiếm dựa theo productId
          { $set: { status: 'disabled' } },  // Cập nhật trạng thái
          { new: true }  // Trả về tài liệu đã cập nhật
        );
  
        if (updatedAuction) {
          console.log(`Updated auction for productId: ${auction.productId}, updated auction:`, updatedAuction);
        } else {
          console.log(`No auction found for productId: ${auction.productId}`);
        }
      }
  
    } catch (error) {
      console.error('Error updating auction statuses:', error);
    }
  }
}


module.exports = scheduelAuction;