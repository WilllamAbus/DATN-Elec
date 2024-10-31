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
  _id: string;
  image: {
    image: string[]; 
    color: { _id: string; name: string };
    slug: string;
}[];
  variant_name: string;
  variant_price: number;
  product_ratingAvg: number;
  weight_g: number; 
  product_discount: {
    discountId: string;
    code: string; 
    discountPercent: number; 
    isActive: boolean; 
    status: string; 
    disabledAt: Date | null;
  };
}

export interface RelatedProductsResponse {
  relatedVariants: ProductRelated[]; 
}