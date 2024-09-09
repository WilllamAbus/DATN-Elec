import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../../types/ProductV2"; 
export type SetValueScreen = UseFormSetValue<ProductV2>;
export interface ScreenOption {
  value: string;
  label: string;
}
