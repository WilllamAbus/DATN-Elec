import { ProductVariant } from "../../../types/ProductV2";
export interface WatchlistItem {
  _id: string;
  user: string;
  product: {
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
    product_price_unit: number;
    product_attributes: { k: string; v: string }[];
    weight_g: number;
    image: string[];
  };
  productVariant: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
