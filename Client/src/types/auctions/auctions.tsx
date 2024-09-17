// src/types/auctionTypes.ts

export interface AuctionDataComplete {
  _id:string
    productId: string;
    auctionEndTime: string; // Time when auction ends
    auction_winner: string | null; // Winner of the auction, null if no winner
    auction_quantity: number; // Number of bids
    auction_total: number; // Total amount of all bids
    auctionTime: Date; // Auction start time
    biddings: string[]; // Array of bidding IDs
    stateAuction: string; // Auction state (e.g., "confirmed", "in-progress")
    isActive: boolean; // Is the auction still active?
  }
  
  export interface BiddingData {
    bidder: string; // Bidder's ID
    bidAmount: number; // Bid amount
    bidTime: Date; // Time of the bid
    stateBidding: string; // State of the bidding
  }
  