import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant, GRAPHICSCARD } from "../../../../../services/product_v2/admin/types/addVariant"; 
export const handleCardChange = (
  selectedOption: SingleValue<GRAPHICSCARD>, 
  setSelectedCard: React.Dispatch<React.SetStateAction<SingleValue<GRAPHICSCARD>>>, 
  setValue: UseFormSetValue<ProductVariant>
) => {
  setSelectedCard(selectedOption);
  const graphicCardData: GRAPHICSCARD = selectedOption ? {
    _id: selectedOption._id,
    name: selectedOption.name,
    status: selectedOption.status,
    sku: selectedOption.sku,
    pid: selectedOption.pid,
    createdAt: selectedOption.createdAt,
    updatedAt: selectedOption.updatedAt,
    slug: selectedOption.slug,
  } : {
    _id: '',
    name: '',
    status: '',
    sku: '',
    pid: '',
    createdAt: '',
    updatedAt: '',
    slug: '',
  };
  setValue("graphicsCard", [graphicCardData]);
};
