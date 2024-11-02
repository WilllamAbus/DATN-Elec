import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ImageVariant } from "../../../../../services/product_v2/admin/types/imageVariant";
import { Color } from "../../../../../services/product_v2/admin/types/getVariantColorsById";
export const handleColorImageVariantChange = (
  selectedOption: SingleValue<Color>, 
  setSelectedColor: React.Dispatch<React.SetStateAction<SingleValue<Color>>>, 
  setValue: UseFormSetValue<ImageVariant>
) => {
  setSelectedColor(selectedOption);
  
  if (selectedOption) {
    const colorData: Color = {
      _id: selectedOption._id,
      name: selectedOption.name,
      code: selectedOption.code,
    };

    setValue("color", colorData._id); 
  } else {
    setValue("color", undefined); 
  }
};
