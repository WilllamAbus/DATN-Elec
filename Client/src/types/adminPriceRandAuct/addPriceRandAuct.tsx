export interface AuctionPricingRange {
    startTime: string; // ISO format
    endTime: string; // ISO format
    startingPrice: number;
    maxPrice: number;
    priceStep: number;
    product_randBib: string; // ID of the product
    _id: string; // ID of
  }
  
  export interface AuctionResponse {
    success: boolean;
    message: string;
    data?: AuctionPricingRange; // Contains auction data on success
    error?: string; // Error message if failed
  }
  export interface Product {
    _id: string;
    product_name: string;
    product_price_unit: number;
    image: string[];
  }
  
  export interface PriceRandResponseAdd {
    status: number;
    message: string;
    data: Product[];
  }

  export interface PriceRandData {
    maxPrice?:string, 
    startTime?: string, 
    endTime?: string,
   priceStep?: string , 
   startingPrice?: string
    // product_randBid?:string
      // Optional string to allow either endTime or endTimeBid to be null
    // Similar to endTime
  }


export  interface InboundData {
    _id: string;
    productAuction: string;
    inbound_description: string;
    inbound_quantity: number;
    inbound_price: number;
    totalPriceInbound: number;
    status: 'active' ; // You can modify this if there are other status values
    createdAt: string; // ISO 8601 formatted date string
    updatedAt: string; // ISO 8601 formatted date string
    __v: number;
  }
  

export  type InboundDataResponse = {
    success: boolean;
    message: string;
    data: InboundData;
  };
  