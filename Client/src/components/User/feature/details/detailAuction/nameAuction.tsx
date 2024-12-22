import React from "react";
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction"; 

interface ProductNameAuctionProps {
  product: Partial<ProductAuction>; 

}
const ProductName: React.FC<ProductNameAuctionProps> = ({ product }) => {
  return (
    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
      {product.product_name}
    </h1>
  );
};

export default ProductName;
