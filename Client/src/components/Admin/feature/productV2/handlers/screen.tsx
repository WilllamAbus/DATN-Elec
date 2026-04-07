import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, SCREEN } from "../../../../../services/product_v2/admin/types/addVariant"; 

export const handleScreenChange = (
  selectedOption: SingleValue<SCREEN>, 
  setSelectedScreen: React.Dispatch<React.SetStateAction<SingleValue<SCREEN>>>, 
  setValue: UseFormSetValue<ProductVariant>
) => {
  setSelectedScreen(selectedOption);

  const screenData: SCREEN = selectedOption ? {
    _id: selectedOption._id,
    name: selectedOption.name,
    status: selectedOption.status,
    sku: selectedOption.sku,
    pid: selectedOption.pid,
    createdAt: selectedOption.createdAt,
    updatedAt: selectedOption.updatedAt,
    slug: selectedOption.slug
  } : {
    _id: '',
    name: '',
    status: '',
    sku: '',
    pid: '',
    createdAt: '',
    updatedAt: '',
    slug: ''
  };

  setValue("screen", [screenData]); 
};
