import { SingleValue } from "react-select";
import { UseFormSetValue } from "react-hook-form";
import { ProductVariant } from "../../../../../services/product_v2/admin/types";
import { CardOption } from "../types/variant_product";

export const handleCardChange = (
  selectedOption: SingleValue<CardOption>,
  setSelectedCard: React.Dispatch<React.SetStateAction<SingleValue<CardOption>>>,
  setValue: UseFormSetValue<ProductVariant>,
  getValues: () => ProductVariant
) => {
  setSelectedCard(selectedOption);
  const cardValue = selectedOption ? selectedOption.label : '';
  const currentVariantAttributes = getValues().variant_attributes || [];
  const updateVariantAttributes = currentVariantAttributes.filter(attr => attr.k !== "Card").concat({
    k: "Card",
    v: cardValue
  });
  
  setValue("variant_attributes", updateVariantAttributes);
};
