import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../../types/ProductV2"; 
export type SetValueCPU = UseFormSetValue<ProductV2>;
export interface CPUOption {
  value: string;
  label: string;
}