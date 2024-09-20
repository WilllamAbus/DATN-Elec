// src/services/socketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4000'); // Ensure this matches your server URL
  }

  // Handle socket connection and disconnection
  public connection() {
    this.socket.on('connect', () => {
      console.log(`Connected with ID: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`Disconnected from ID: ${this.socket.id}`);
    });

    // Handle auction completion event emitted from the server
    this.socket.on('auctionComplete', (data: any) => {
      console.log('Auction completed:', data);
      // Here you can dispatch actions to update your UI or Redux store with the completed auction data
    });

    // Handle bid creation
    this.socket.on('createBidding', (data: any) => {
      console.log('Bid created:', data);
    });

    // Handle bid update
    this.socket.on('update-bid', (data: any) => {
      console.log('Bid updated:', data);
    });

    // Handle notifications
    this.socket.on('notification', (data: any) => {
      console.log('Notification received:', data);
    });
  }

  // Emit auction completion event from client to server
  public emitAuctionComplete(productId: string, auctionData: any, timeTrackID: string) {
    this.socket.emit('auctionComplete', { productId, auctionData, timeTrackID });
    console.log('Auction complete emitted:', { productId, auctionData, timeTrackID });
  }

  // Emit new bid creation event from client to server
  public emitCreateBidding(productId: string, bidData: any) {
    this.socket.emit('createBidding', { productId, bidData });
    console.log('Bid creation emitted:', { productId, bidData });
  }

  // Emit bid update event from client to server
  public emitUpdateBidding(productId: string, bidData: any) {
    this.socket.emit('update-bid', { productId, bidData });
    console.log('Bid update emitted:', { productId, bidData });
  }

  // Emit a general notification event from client to server
  public emitNotification(notificationData: any) {
    this.socket.emit('notification', notificationData);
    console.log('Notification emitted:', notificationData);
  }
}

const socketService = new SocketService();
export default socketService;
