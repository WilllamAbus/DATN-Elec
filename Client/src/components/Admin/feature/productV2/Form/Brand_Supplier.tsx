// components/BrandSupplierSelect.tsx
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Product} from "../../../../../services/product_v2/admin/types/add-product";
import { BrandSelect, SupplierSelect } from "../select";

interface BrandSupplierProps {
  brands: any[];
  suppliers: any[];
  register: UseFormRegister<Product>;
  errors: {
    product_brand?: string;
    product_supplier?: string;
  };
}

const BrandSupplierSelect: React.FC<BrandSupplierProps> = ({
  brands,
  suppliers,
  register,
  errors,
}) => (
  <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
    <h3 className="mb-4 text-xl font-semibold dark:text-white">Thương hiệu &amp; Nhà cung cấp</h3>
    <BrandSelect brands={brands} register={register} error={errors.product_brand} />
    <SupplierSelect suppliers={suppliers} register={register} error={errors.product_supplier} />
  </div>
);

export default BrandSupplierSelect;
