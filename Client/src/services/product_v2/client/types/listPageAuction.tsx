interface ProductDiscountClient {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
}
export interface ProductBrand {
  _id: string;
  name: string;
}
export interface ProductCondition {
  _id: string;
  nameCondition: string;
}


export interface products {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: { name: string };
  createdAt: string;
  product_discount: ProductDiscountClient;
  view: number;
  product_ratingAvg: number;
  product_supplier: string;
  product_brand: ProductBrand; 
  product_format: string;
  product_condition: ProductCondition;
  product_quantity: number;
  product_price: number;
  product_attributes: { k: string; v: string }[];
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

export interface LimitPageAuctionProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    products: products[];
    brand: ProductBrand[];  
    conditionShopping: ProductCondition[];  
  };
  pagination: Pagination;
}

export interface FilterState {
  _sort: string;
  brand?: ProductBrand[];
  conditionShopping?: ProductCondition[];
  minPrice?: number;
  maxPrice?: number;
  minDiscountPercent?: number;
  maxDiscountPercent?: number;
  [key: string]: string | number | ProductBrand[] | ProductCondition[] | undefined; 
}

