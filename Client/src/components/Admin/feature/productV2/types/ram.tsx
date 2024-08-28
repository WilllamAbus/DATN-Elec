

import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2"; 
export type SetValueRam = UseFormSetValue<ProductV2>;
export interface RamOption {
  value: string;
  label: string;
}