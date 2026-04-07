
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../.././../services/product_v2/admin/types";
export type SetValueColor = UseFormSetValue<ProductVariant>;
export interface ColorOption {
  value: string;
  label: string;
  color: string;
}
