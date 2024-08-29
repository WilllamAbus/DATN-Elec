import { MultiValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { ColorOption } from "../types";
export const handleColorChange = (
  selectedOptions: MultiValue<ColorOption>,
  setSelectedColors: React.Dispatch<React.SetStateAction<MultiValue<ColorOption>>>,
  setValue: UseFormSetValue<ProductV2>,
  getValues: () => ProductV2 
) => {
  setSelectedColors(selectedOptions);
  const colorValues = selectedOptions.map((option) => option.label).join(', ');
  const currentAttributes = getValues().product_attributes || [];
  const updatedAttributes = currentAttributes.filter(attr => attr.k !== "Color").concat({
    k: "Color", 
    v: colorValues
  });
  setValue("product_attributes", updatedAttributes);
};

