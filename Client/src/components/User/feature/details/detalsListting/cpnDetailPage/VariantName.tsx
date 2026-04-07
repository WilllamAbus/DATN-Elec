import React from "react";
import { products, ProductVariant } from "../../../../../../services/detailProduct/types/getDetailProduct"; 

interface VariantNameProps {
  product: Partial<products>; 
  variant: ProductVariant;
}

const VariantName: React.FC<VariantNameProps> = ({ variant, product }) => {
  const variantName = variant ? variant.variant_name : undefined;
  return (
    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
      {variantName || product.product_name}
    </h1>
  );
};

export default VariantName;
