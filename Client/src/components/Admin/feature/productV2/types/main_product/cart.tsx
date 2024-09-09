import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../../types/ProductV2";
export type SetValueCard = UseFormSetValue<ProductV2>;
export interface CardOption {
  value: string;
  label: string;
}
