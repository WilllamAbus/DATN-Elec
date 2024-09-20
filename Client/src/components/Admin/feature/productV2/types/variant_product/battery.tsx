import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../.././../services/product_v2/admin/types";
export type SetValueBattery = UseFormSetValue<ProductVariant>;
export interface BatteryOption {
  value: string;
  label: string;
}
