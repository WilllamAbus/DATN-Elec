import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { ColorOption } from "../types";

export const handleColorChange = (
  selectedOption: SingleValue<ColorOption>,
  setSelectedColors: React.Dispatch<React.SetStateAction<SingleValue<ColorOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2 
) => {
  setSelectedColors(selectedOption);
  const colorValue = selectedOption ? selectedOption.label : '';
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Color").concat({
    k: "Color", 
    v: colorValue
  });
  setValue("product_attributes", updatedAttributes);
};
