import { UseFormSetValue } from "react-hook-form";
import { Product} from "../../../../../services/product_v2/admin/types/add-product";

export const resetProductAttributes = (setValue: UseFormSetValue<Product>) => {
  setValue("variants", [], { shouldValidate: true, shouldDirty: true });
};
