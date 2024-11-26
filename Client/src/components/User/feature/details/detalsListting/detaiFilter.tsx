import React from "react";
import FilterStorage from "./filter/StorageSelector";
import FilterColor from "./filter/ColorSelector";
import { FilterState, STORAGE,COLOR } from "../../../../../services/detailProduct/types/getDetailProduct";

interface DetailFiltersProps {
  filters: FilterState;  
  onChange?: (newFilters: FilterState) => void;
}

const DetailFilters: React.FC<DetailFiltersProps> = ({ filters, onChange = () => {} }) => {
  const handleStorageChange = (selectedStorage: STORAGE | null) => {
    const newFilters: FilterState = {
      ...filters,
      storage: selectedStorage ? selectedStorage.slug : null,  
    };
    onChange(newFilters);
  };
  const handleColorChange = (selectedColor: COLOR | null) => {
    const newFilters: FilterState = {
      ...filters,
      color: selectedColor ? selectedColor.slug : null,  
    };
    onChange(newFilters);
  };


  return (
    <div className="flex justify-between space-x-4"> {/* Sử dụng Flexbox và tạo khoảng cách */}
    <FilterStorage filters={filters} onChange={handleStorageChange} />
    <FilterColor 
        filters={filters} 
        onChange={handleColorChange} 
        isStorageSelected={!!filters.storage} // Pass this prop to indicate storage selection
      />
  </div>
  );
};

export default DetailFilters;
