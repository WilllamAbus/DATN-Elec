import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Category } from "../../../../../services/product_v2/admin/types";

interface CategorySelectProps {
  categories: Category[];
  register: UseFormRegister<any>;
  error: string | undefined;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, register, error }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="product_type"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Danh mục sản phẩm
      </label>
      <select
        id="product_type"
        className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        {...register("product_type", { required: "Danh mục không được bỏ trống" })}
      >
        <option value="">Chọn danh mục</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center mt-2 text-red-600">
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
