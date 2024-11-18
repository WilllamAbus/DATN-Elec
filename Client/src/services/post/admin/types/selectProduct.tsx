export interface Product {
  _id: string;
  product_name: string;
}

export interface SelectProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  products: Product[];
}
export interface ProductStateList {
  products: Product[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}