import React from "react";
import FilterStorage from "./filter/StorageSelector";
import { FilterState, STORAGE, ProductVariant } from "../../../../../services/detailProduct/types/getDetailProduct";

interface DetailFiltersProps {
  filters: FilterState;
  variants: ProductVariant[];  
  onChange?: (newFilters: FilterState) => void;
}

const DetailFilters: React.FC<DetailFiltersProps> = ({ filters, variants, onChange = () => {} }) => {
  const handleStorageChange = (selectedStorage: STORAGE | null) => {
    const newFilters: FilterState = {
      ...filters,
      storage: selectedStorage ? selectedStorage.slug : null,  
    };
    onChange(newFilters);
  };
  
  

  return (
    <div>
      <FilterStorage variants={variants} filters={filters} onChange={handleStorageChange} />
    </div>
  );
};

export default DetailFilters;
