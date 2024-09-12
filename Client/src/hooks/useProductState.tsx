import { useState } from "react";
import { ProductV2 } from "../types/ProductV2";

const useProductState = () => {
  const [product, setProduct] = useState<ProductV2>({
    _id: "",
    product_name: "",
    product_description: "",
    product_type: "",
    createdAt: "",
    product_discount: 0,
    product_brand: "",
    product_format: "",
    product_condition: "",
    product_supplier: "",
    product_quantity: 0,
    product_price: 0,
    product_attributes: [],
    weight_g: 0,
    image: undefined,
    hasVariants: false,
  });

  const updateProduct = (newProduct: Partial<ProductV2>) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      ...newProduct,
    }));
  };

  return {
    product,
    updateProduct,
  };
};

export default useProductState;
