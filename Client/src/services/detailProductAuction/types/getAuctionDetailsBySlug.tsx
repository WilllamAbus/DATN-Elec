
  export interface User {
    _id: string;
    name: string;
    email: string;
  }


  export interface Bidder {
    user: User;
    bidPrice: number;
    status: string;
    statusCode: number;
  }

  export interface Product {
    name: string;
    slug: string;
  }


  export interface AuctionDetailsResponse {
    code: string;
    status: string;
    message: string;
    product: Product;
    bidders: Bidder[];
  }
