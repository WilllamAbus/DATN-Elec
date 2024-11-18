export interface ProductAuction {
  _id: string;
  product_name: string;
  image: string[];
  product_description: string;
  product_discount: Discount;
  product_ratingAvg: number;
  product_view: number;
  product_price: number;
  product_price_unit: number;
  weight_g: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  product_type: ProductType;
  product_brand: ProductBrand;
  product_condition: ProductCondition;
  product_supplier: ProductSupplier;
}

export interface Discount {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
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
  __v: number;
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
  __v: number;
}

export interface ProductCondition {
  _id: string;
  nameCondition: string;
  status: string;
  disabledAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductSupplier {
  _id: string;
  name: string;
  address: string;
  phone: string; 
  image: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LimitDeleteListAuctionResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    productAuction: ProductAuction[];
  };
  pagination: Pagination;
}


export interface Comment {
  _id: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}
