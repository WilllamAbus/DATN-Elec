export interface ProductAdd {
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
export interface ProductStateAdd {
  products: ProductAdd[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data?: T;
  error?: string;
}



export const  initialState: ProductStateAdd = {
  products: [],
  status: "idle",
  error: null,
  isLoading: false,
};
