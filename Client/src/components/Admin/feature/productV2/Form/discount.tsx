import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ProductVariant } from "../../../../../services/product_v2/admin/types/addVariant";
import { DiscountSelect } from "../select";

interface DiscountProps {
  discounts: any[];
  register: UseFormRegister<ProductVariant>;
  errors: {
    variant_discount?: string;
  };
}

const DiscountSelectComponent: React.FC<DiscountProps> = ({
  discounts,
  register,
  errors,
}) => (
  <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
    <h3 className="mb-4 text-xl font-semibold dark:text-white">Danh mục &amp; Giảm giá</h3>
    <DiscountSelect
      discounts={discounts}
      register={register}
      error={errors.variant_discount} 
    />
  </div>
);

export default DiscountSelectComponent;
