import React from 'react';
import currencyFormatter from 'currency-formatter';
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction";

interface ProductPriceProps {
  product: ProductAuction;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ product }) => {
  const maxPrice = product.auctionPricing.maxPrice;

  const formattedMaxPrice = currencyFormatter.format(maxPrice, { code: 'VND', symbol: '' });

  return (
    <p className="text-2xl font-extrabold text-redCustom sm:text-3xl dark:text-white">
      Giá tối đa: {formattedMaxPrice}đ
    </p>
  );
};

export default ProductPrice;
