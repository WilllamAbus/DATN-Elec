export interface AuctionPricing {
  _id: string;
  startTime: string;
  endTime: string;
  startingPrice: number;
  remainingTime: string; 
  maxPrice: number;
  currentPrice: number;
  priceStep: number;
  userBidPrice: number | null;
  status: string;
  product_randBib: string;
  hasWinner:Boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  _id: string;
  name: string;
  status: string;
  pid: string;
  path: string;
  imgURL: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface ProductBrand {
  _id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  category_id: string;
  supplier_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCondition {
  _id: string;
  nameCondition: string;
  status: string;
  disabledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSupplier {
  _id: string;
  name: string;
  address: string;
  phone: number;
  image: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAuction {
  _id: string;
  product_name: string;
  image: string[];
  product_description: string;
  product_type: ProductType;
  product_brand: ProductBrand;
  product_condition: ProductCondition;
  product_supplier: ProductSupplier;
  weight_g: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  auctionPricing: AuctionPricing;
  lastViewed: string;
  viewCount: number;
}

export interface ProductAuctionResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: ProductAuction;
}
