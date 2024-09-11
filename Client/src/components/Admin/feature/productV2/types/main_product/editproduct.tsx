export interface ProductGetOne {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: { name: string };
  createdAt: string;
  product_discount: number;
  product_supplier: { name: string };
  product_brand: { name: string };
  product_format: { formats: string[] };
  product_condition: { nameCondition: string };
  product_quantity: number;
  product_price: number;
  product_attributes: { k: string; v: string }[];
  weight_g: number;
  image: string[];
  status: string;
}

export interface GetOneResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  product?: ProductGetOne;
}

export interface ProductUpdate {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: string;
  createdAt: string;
  product_discount: number;
  product_supplier: string;
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_quantity: number;
  product_price: number;
  product_attributes: { k: string; v: string }[];
  weight_g: number;
  image?: FileList;
  hasVariants: boolean;
}

export interface UpdateProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  updatedProduct?: ProductUpdate;
}
