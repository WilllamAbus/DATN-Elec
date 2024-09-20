export interface Brand {
  _id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  category_id: string;
  supplier_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetAllBrandPageAuctionResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  brands: Brand[];
  error?: string;
}