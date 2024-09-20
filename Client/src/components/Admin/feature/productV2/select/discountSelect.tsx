import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Discount } from "../../../../../services/product_v2/admin/types";

interface DiscountSelectProps {
  discounts: Discount[];
  register: UseFormRegister<any>;
  error: string | undefined;
}

const DiscountSelect: React.FC<DiscountSelectProps> = ({ discounts, register, error }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="product_discount"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Chương trình giảm giá
      </label>
      <select
        id="product_discount"
        className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        {...register("product_discount", { required: "Giảm giá không được bỏ trống" })}
      >
        <option value="">Chọn chương trình giảm giá</option>
        {discounts.map((discount) => (
          <option key={discount._id} value={discount._id}>
            {discount.discountPercent}
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

export default DiscountSelect;
