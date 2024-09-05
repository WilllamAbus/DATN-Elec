export interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: { name: string }; 
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
  image: string[];
  status: string;
}
export interface ProductStateList {
  products: Product[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}
export interface ListProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  products: Product[];
  error?: string; 
}


export interface DeletedListResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  products: Product[];
  error?: string;
}