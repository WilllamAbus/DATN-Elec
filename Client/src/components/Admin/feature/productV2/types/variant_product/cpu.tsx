import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../.././../services/product_v2/admin/types";
export type SetValueCPU = UseFormSetValue<ProductVariant>;
export interface CPUOption {
  value: string;
  label: string;
}