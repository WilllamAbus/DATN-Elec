// components/CategoryDiscountSelect.tsx
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Product} from "../../../../../services/product_v2/admin/types/add-product";
import { CategorySelect } from "../select";

interface CategoryDiscountProps {
  categories: any[];
  register: UseFormRegister<Product>;
  errors: {
    product_type?: string;
  };
}

const CategoryDiscountSelect: React.FC<CategoryDiscountProps> = ({
  categories,
  register,
  errors,
}) => (
  <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
    <h3 className="mb-4 text-xl font-semibold dark:text-white">Danh mục &amp; Giảm giá</h3>
    <CategorySelect categories={categories} register={register} error={errors.product_type} />
  </div>
);

export default CategoryDiscountSelect;
