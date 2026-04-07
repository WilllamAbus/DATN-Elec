export interface EditPriceRandAuctData {
    maxPrice?:string, 
    startTime?: string, 
    endTime?: string,
   priceStep?: string , 
   startingPrice?: string
   product_randBib?: string
  }


  export interface EditAuctionPricingRange {
    startTime: string; // ISO format
    endTime: string; // ISO format
    startingPrice: number;
    maxPrice: number;
    priceStep: number;
    product_randBib: string; // ID of the product
    _id: string; // ID of
  }
  
  export interface EditAuctionResponse {
    success: boolean;
    message: string;
    data?: EditAuctionPricingRange; // Contains auction data on success
    error?: string; // Error message if failed
  }
  export interface Product {
    _id: string;
    product_name: string;

    image: string[];
  }
  
  export interface PriceRandResponseAdd {
    status: number;
    message: string;
    data: Product[];
  }