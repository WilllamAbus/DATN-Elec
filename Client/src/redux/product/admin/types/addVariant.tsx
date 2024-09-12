
export interface VariantAttributes {
  k: string;
  v: string;
}

export interface ProductVariant {
  variant_name: string;
  variant_description: string;
  variant_price: number;
  variant_color: string;
  createdAt:string;
  variant_attributes: VariantAttributes[];
  image?: FileList;
  sku: string;
  isActive: boolean;
}

export interface ProductVariantResponse<T> {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data?: T; 
  error?: string;
}
export interface ProductStateAddVariant {
  variants: ProductVariant[]; 
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
}
