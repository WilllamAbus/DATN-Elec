export interface ProductV2 {
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
  variants?: ProductVariant[]; 
}
export interface ProductVariant {
  _id: string;
  variant_name: string;
  variant_price: number;
  ram: string | null;
  color?: string | null;
  cpu?: string| null;
  graphicsCard?: string| null;
  battery?:string | null;
  operatingSystem?: string| null;
  screen?: string| null;
  storage?: string| null;
  image: string[];
  sku: string;
  status: 'active' | 'inactive';
  product: string; 
  inventory: string[]; 
}
