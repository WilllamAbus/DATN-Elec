import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../../services/product_v2/admin/types";
import { ScreenOption } from "../types/variant_product";

export const handleScreenChange = (
  selectedOption: SingleValue<ScreenOption>,
  setSelectedScreen: React.Dispatch<React.SetStateAction<SingleValue<ScreenOption>>>,
  setValue: UseFormSetValue<ProductVariant>,
  getValues: () => ProductVariant
) => {
  setSelectedScreen(selectedOption);
  const screenValue = selectedOption ? selectedOption.label : '';
  const currentVariantAttributes = getValues().variant_attributes || [];
  const updateVariantAttributes = currentVariantAttributes.filter(attr => attr.k !== "Screen").concat({
    k: "Screen",
    v: screenValue
  });
  setValue("variant_attributes", updateVariantAttributes);
};
