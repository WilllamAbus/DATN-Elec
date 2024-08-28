import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { ScreenOption } from "../types";
export const handleScreenChange = (
  selectedOptions: MultiValue<ScreenOption>,
  setSelectedScreen: React.Dispatch<React.SetStateAction<MultiValue<ScreenOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedScreen(selectedOptions);
  const screenValues = selectedOptions.map((option) => option.label).join(', ');
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Screen").concat({
    k: "Screen",
    v: screenValues
  });
  setValue("product_attributes", updatedAttributes);
};
