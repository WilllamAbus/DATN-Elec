import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { ScreenOption } from "../types/main_product";

export const handleScreenChange = (
  selectedOption: SingleValue<ScreenOption>,
  setSelectedScreen: React.Dispatch<React.SetStateAction<SingleValue<ScreenOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2
) => {
  setSelectedScreen(selectedOption);
  const screenValue = selectedOption ? selectedOption.label : '';
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Screen").concat({
    k: "Screen",
    v: screenValue
  });
  setValue("product_attributes", updatedAttributes);
};
