export interface ProductDiscount {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
}

export interface ProductAuction {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: string;
  product_brand: string;
  product_condition: string;
  product_supplier: string;
  product_discount: ProductDiscount;
  product_ratingAvg: number;
  product_view: number;
  product_price: number;
  product_price_unit: number;
  weight_g: number;
  image: string[];
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  comments: any[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface SoftDeleteResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data?: ProductAuction;
  error?: string;
}
