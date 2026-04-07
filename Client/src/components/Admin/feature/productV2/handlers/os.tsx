import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, OPERATINGSYSTEM } from "../../../../../services/product_v2/admin/types/addVariant"; 

export const handleOsChange = (
  selectedOption: SingleValue<OPERATINGSYSTEM>,  
  setSelectedOs: React.Dispatch<React.SetStateAction<SingleValue<OPERATINGSYSTEM>>>,
  setValue: UseFormSetValue<ProductVariant>  
) => {
  setSelectedOs(selectedOption); 

  const osData: OPERATINGSYSTEM = selectedOption
    ? {
        _id: selectedOption._id,
        name: selectedOption.name,
        status: selectedOption.status,
        sku: selectedOption.sku,
        pid: selectedOption.pid,
        createdAt: selectedOption.createdAt,
        updatedAt: selectedOption.updatedAt,
        slug: selectedOption.slug,
      }
    : {
        _id: '',
        name: '',
        status: '',
        sku: '',
        pid: '',
        createdAt: '',
        updatedAt: '',
        slug: '',
      };
  setValue("operatingSystem", [osData]);  
};
