import React from 'react';
import currencyFormatter from 'currency-formatter';
import { ProductVariant, products } from "../../../../../../services/detailProduct/types/getDetailProduct"; 

interface VariantPriceProps {
  variant: ProductVariant;
  product: Partial<products>; 
}
const VariantPrice: React.FC<VariantPriceProps> = ({ variant, product }) => {
  const price = variant.variant_price || (product?.product_price ?? 0); 

  const formattedPrice = currencyFormatter.format(price, { code: 'VND', symbol: '' });

  return (
    <p className="text-2xl font-extrabold text-redCustom sm:text-3xl dark:text-white">
      {formattedPrice}đ
    </p>
  );
};

export default VariantPrice;
