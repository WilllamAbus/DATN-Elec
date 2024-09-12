import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";

export const resetProductAttributes = (setValue: UseFormSetValue<ProductV2>) => {
  setValue("product_attributes", [], { shouldValidate: true, shouldDirty: true });
};
