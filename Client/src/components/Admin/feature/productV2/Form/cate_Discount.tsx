// components/CategoryDiscountSelect.tsx
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ProductV2 } from "../../../../../types/ProductV2";
import { CategorySelect, DiscountSelect } from "../select";

interface CategoryDiscountProps {
  categories: any[];
  discounts: any[];
  register: UseFormRegister<ProductV2>;
  errors: {
    product_type?: string;
    product_discount?: string;
  };
}

const CategoryDiscountSelect: React.FC<CategoryDiscountProps> = ({
  categories,
  discounts,
  register,
  errors,
}) => (
  <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
    <h3 className="mb-4 text-xl font-semibold dark:text-white">Danh mục &amp; Giảm giá</h3>
    <CategorySelect categories={categories} register={register} error={errors.product_type} />
    <DiscountSelect discounts={discounts} register={register} error={errors.product_discount} />
  </div>
);

export default CategoryDiscountSelect;
