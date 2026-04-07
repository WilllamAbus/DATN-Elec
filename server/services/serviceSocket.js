const ProductAuction = require('../model/productAuction/productAuction');

class SocketService {
  setSocketIO(io) {
    global._io = io;
  }

  connection(socket) {
    console.log(`New user connected: ${socket.id}`);

    // Sự kiện đấu giá
    socket.on('bid-auction', async (data) => {
      const { slug, bidPrice, userId } = data;

      try {
        // Xử lý logic đấu giá
        const productAuction = await ProductAuction.findOne({ slug }).populate('auctionPricing');
        if (!productAuction) {
          return socket.emit('bid-error', { msg: 'Sản phẩm đấu giá không tồn tại' });
        }

        const auctionPricingRange = productAuction.auctionPricing;
        if (bidPrice <= auctionPricingRange.currentPrice) {
          return socket.emit('bid-error', { msg: 'Giá đặt phải lớn hơn giá hiện tại' });
        }

        // Cập nhật giá hiện tại và thông báo cho các client khác
        auctionPricingRange.currentPrice = bidPrice;
        await auctionPricingRange.save();

        // Phát sự kiện cập nhật đấu giá tới tất cả client
        global._io.emit('bid-update', {
          slug,
          currentPrice: auctionPricingRange.currentPrice,
        });

      } catch (error) {
        console.error(error);
        socket.emit('bid-error', { msg: 'Lỗi xử lý đấu giá' });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}. Reason: ${reason}`);
    });
  }
}

module.exports = new SocketService();
