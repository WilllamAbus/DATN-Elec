import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ImageVariant } from "../../../../../services/product_v2/admin/types/imageVariant";
import { Color } from "../../../../../services/product_v2/types/attributes/getAllColor";
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
      status: selectedOption.status,
      sku: selectedOption.sku,
      pid: selectedOption.pid,
      createdAt: selectedOption.createdAt,
      updatedAt: selectedOption.updatedAt,
      slug: selectedOption.slug,
      hex: selectedOption.hex,
    };

    setValue("color", colorData._id); 
  } else {
    setValue("color", undefined); 
  }
};
