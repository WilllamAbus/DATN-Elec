import React from "react";
import FilterByBrand from "./filter/filterbybrand";
import FilterByPrice from "./filter/filterbyPrice";
import FilterByRam from "./filter/filterbyRam";
import FilterByConditionShopping from "./filter/filterbyConditionShopping";
import FilterByService from "./filter/filterbyService";
import { FilterState,ProductCondition,ProductBrand,RAM, STORAGE } from "../../../../services/clientcate/client/types/getProuctbyCategory"; 
import FilterByStorage from "./filter/filterbyStorage";
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
  const handleStorageChange = (selectedStorages: STORAGE[]) => {
    const newFilters: FilterState = {
      ...filters,
      storage: selectedStorages.length > 0 ? selectedStorages : undefined,
    };
    onChange(newFilters);
  };
  const handleRamChange = (selectedRams: RAM[]) => {
    const newFilters: FilterState = {
      ...filters,
      ram: selectedRams.length > 0 ? selectedRams : undefined,
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
      <FilterByRam filters={filters} onchange={handleRamChange} />
      <FilterByStorage filters={filters} onchange={handleStorageChange} />
      <FilterByConditionShopping filters={filters} onchange={handleConditionShoppingChange} />
     <FilterByService filters={filters} onchange={handleServiceChange} />
    </div>
  );
};

export default ProductFilters;
