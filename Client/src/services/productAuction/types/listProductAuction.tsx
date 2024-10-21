export interface ProductAuction {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: { name: string };
  createdAt: string;
  product_discount: number;
  product_supplier: string;
  product_brand: string;
  product_condition: string;
  product_quantity: number;
  product_price: number;
  weight_g: number;
  image: string[];
  status: string;
}


export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LimitProductAuctionResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    products: ProductAuction[];
  };
  pagination: Pagination;
}

