class SocketService {

     // Để lưu trữ đối tượng io toàn cục
     setSocketIO(io) {
        global._io = io;
    }
    // connection socket
    connection(socket) {
        console.log(`New user connected: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`User disconnect id is ${socket.id}`);
        });

        // event on here
        socket.on('chat message', msg => {
            console.log(`msg is:::${msg}`);
          _io.emit('chat message', msg); 

        });

        // on room...
    }
    emitAuctionComplete(productId, auctionData, timeTrackID) {
        global._io.emit('auctionComplete', {
            productId,
            auction: auctionData,
            timeTrackID
        });
    }

    emitCreateBidding(productId, bidData) {
        global._io.emit('createBidding', {
            productId,
            bid: bidData
        });
    }
    emitUpdateAmountBidding(productId, bidData) {
        global._io.emit('update-bid', {
            productId,
            bid: bidData
        });
    }
    emitNotification(notificationData) {
        global._io.emit('notification', notificationData);
    }

      // Phát sự kiện cảnh báo tồn kho thấp
      emitInventory(productId, productName, quantityStock) {
        global._io.emit('inventoryWarning', {
            productId,
            productName,
            quantityStock,
            message: `Sản phẩm ${productName} có số lượng tồn kho thấp: ${quantityStock}.`
        });
    }

    
}

// Make sure to export the correct class name
module.exports = new SocketService();