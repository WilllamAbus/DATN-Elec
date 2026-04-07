

import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../.././../services/product_v2/admin/types";
export type SetValueRam = UseFormSetValue<ProductVariant>;
export interface RamOption {
  value: string;
  label: string;
}