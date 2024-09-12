export interface ProductV2 {
  product_name: string;
  product_description: string;
  product_type: string;
  product_discount: number;
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_quantity: number;
  product_price: number;
  product_attributes: object;
  weight_g: number;
  image?: FileList;
}
