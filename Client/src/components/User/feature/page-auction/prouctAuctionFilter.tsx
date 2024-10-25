import React from "react";
import FilterByBrand from "./filterAuction/filterbybrand";
import FilterByPrice from "./filterAuction/filterbyPrice";

import FilterByConditionShopping from "./filterAuction/filterbyConditionShopping";
import FilterByService from "./filterAuction/filterbyService";
import { FilterState,ProductCondition,ProductBrand } from "../../../../services/product_v2/client/types/listPageAuction"; 
interface ProductFiltersProps {
  filters: FilterState;
  onChange?: (newFilters: FilterState) => void;
}
const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onChange = () => {} }) => {
  const handleBrandChange = (selectedBrands: ProductBrand[]) => {
    const newFilters: FilterState = {
      ...filters,
      brand: selectedBrands.length > 0 ? selectedBrands : undefined,
    };
    onChange(newFilters);
  };

  const handleConditionShoppingChange = (selectedConditions: ProductCondition[]) => {
    const newFilters: FilterState = {
      ...filters,
      conditionShopping: selectedConditions.length > 0 ? selectedConditions : undefined,
    };
    onChange(newFilters);
  };
  const handlePriceChange = (minPrice: number | null, maxPrice: number | null) => {
    const newFilters = {
      ...filters,
      minPrice: minPrice !== null ? minPrice : undefined,
      maxPrice: maxPrice !== null ? maxPrice : undefined,
    };
    onChange(newFilters);
  };
  const handleServiceChange = (minDiscountPercent: number | null, maxDiscountPercent: number | null) => {
    const newFilters = {
      ...filters,
      minDiscountPercent: minDiscountPercent !== null ? minDiscountPercent : undefined,
      maxDiscountPercent: maxDiscountPercent !== null ? maxDiscountPercent : undefined,
    };
    onChange(newFilters);
  };
  return (
    <div>
      <FilterByPrice onchange={handlePriceChange} />
      <FilterByBrand filters={filters} onchange={handleBrandChange} />
      <FilterByConditionShopping filters={filters} onchange={handleConditionShoppingChange} />
      <FilterByService filters={filters} onchange={handleServiceChange} />
    </div>
  );
};

export default ProductFilters;
