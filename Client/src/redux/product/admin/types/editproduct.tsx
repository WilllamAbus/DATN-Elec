export interface ProductGetOne {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: string;
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
export interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: string;
  product_discount: number;
  hasVariants: boolean;
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_supplier: string;
  product_ratingAvg: number;
  product_view: number;
  product_price: number;
  product_price_unit?: number;
  weight_g: number;
  isActive: boolean;
  status: 'active' | 'inactive';
  disabledAt?: Date | null;
  variants: ProductVariant[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  product_slug: string;
  image?: FileList;
}
export interface UpdateProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  updatedProduct?: Product;
}
export interface ProductStateUpdate {
  products: Product[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}
export const initialProductState: ProductStateUpdate = {
  products: [], 
  status: "idle", 
  error: null, 
  isLoading: false, 
};





export interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: string;
  product_discount: number;
  hasVariants: boolean;
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_supplier: string;
  product_ratingAvg: number;
  product_view: number;
  product_price: number;
  product_price_unit?: number;
  weight_g: number;
  isActive: boolean;
  status: 'active' | 'inactive';
  disabledAt?: Date | null;
  variants: ProductVariant[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  product_slug: string;
  image?: FileList;
}


export interface ProductVariant {
  _id: string;
  variant_name: string;
  variant_price: number;
  ram: string | null;
  color?: string | null;
  cpu?: string | null;
  graphicsCard?: string | null;
  battery?: string | null;
  operatingSystem?: string | null;
  screen?: string | null;
  storage?: string | null;
  image?: FileList;
  sku: string;
  status: 'active' | 'inactive';
  product: string;
  inventory: string[];
}

export interface Comment {
  _id: string;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}
