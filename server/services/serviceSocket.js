class SocketService {

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

    
}

// Make sure to export the correct class name
module.exports = new SocketService();