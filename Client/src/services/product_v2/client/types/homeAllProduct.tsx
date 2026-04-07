export interface Product {
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
}
export interface ProductAttribute {
  k: string;
  v: string;
  _id: string; 
}
export interface HomeAllProductResponse {   
  success: boolean;
  err: number;
  msg: string;
  status: number;
  products: Product[];
  error?: string;
}
export interface ProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  product: Product | null;
  error?: string;
}
export interface ProductRelated {
  slug: string
  variant_id: string; // ID của biến thể sản phẩm
  variant_name: string; // Tên của biến thể sản phẩm
  variant_price: number;
  discount_percent: number; // Phần trăm giảm giá
  images: string[]; // Mảng các URL hình ảnh
}

export interface RelatedProductsResponse {
  "Sản phẩm gợi ý": ProductRelated[];
}