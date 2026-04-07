import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Supplier } from "../../../../../services/product_v2/admin/types";
interface SupplierSelectProps {
  suppliers: Supplier[];
  register: UseFormRegister<any>;
  error: string | undefined;
}

const SupplierSelect: React.FC<SupplierSelectProps> = ({ suppliers, register, error }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="product_supplier"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Nhà cung cấp
      </label>
      <select
        id="product_supplier"
        className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        {...register("product_supplier", { required: "Nhà cung cấp không được bỏ trống" })}
      >
        <option value="">Chọn nhà cung cấp</option>
        {suppliers.map((supplier) => (
          <option key={supplier._id} value={supplier._id}>
            {supplier.name}
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

export default SupplierSelect;
