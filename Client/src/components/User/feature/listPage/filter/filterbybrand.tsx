import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { getAllBrandPageAuctionThunk } from '../../../../../redux/product/client/Thunk';
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import XIcon from '../svg/deleteicon';
import { ProductBrand, FilterState } from '../../../../../services/clientcate/client/types/getProuctbyCategory';

interface FilterByBrandProps {
  onchange?: (selectedBrands: ProductBrand[]) => void;
  filters: FilterState;
}

interface Option {
  value: string;
  label: string;
  checked: boolean;
  brand?: ProductBrand;
}

const FilterByBrand: React.FC<FilterByBrandProps> = ({ onchange, filters }) => {
  const dispatch: AppDispatch = useDispatch();
  const brands = useSelector((state: RootState) => state.productClient.getAllBrandPageAuction.brands || []);
  const [selectedBrands, setSelectedBrands] = useState<ProductBrand[]>([]);

  useEffect(() => {
    dispatch(getAllBrandPageAuctionThunk());
  }, [dispatch]);

  useEffect(() => {
    if (filters.brand) {
      setSelectedBrands(filters.brand);
    } else {
      setSelectedBrands([]);
    }
  }, [filters.brand]);

  const handleBrandClick = (brand: ProductBrand) => {
    const isSelected = selectedBrands.some((selected) => selected._id === brand._id);
    const newSelectedBrands = isSelected
      ? selectedBrands.filter((selected) => selected._id !== brand._id)
      : [...selectedBrands, brand];
       
    setSelectedBrands(newSelectedBrands);
    if (onchange) {
      onchange(newSelectedBrands);
    }
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    if (onchange) {
      onchange([]);
    }
  };

  const options: Option[] = [
    { value: 'select-all', label: 'Bỏ chọn tất cả', checked: false },
    ...brands.map((brand) => ({
      value: brand._id,
      label: brand.name,
      checked: selectedBrands.some((selected: ProductBrand) => selected._id === brand._id),
      brand: brand,
    })),
  ];

  const showClearAllOption = selectedBrands.length > 0;

  return (
    <Disclosure as="div" className="border-t border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Thương hiệu</span>
          <span className="ml-6 flex items-center">
            <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
            <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div className="space-y-4">
          {options.map((option, optionIdx) => (
            <div key={option.value} className="flex items-center px-2">
              {option.value === 'select-all' ? (
                <button
                  type="button"
                  className={`flex items-center px-2 ${!showClearAllOption ? 'opacity-50 cursor-not-allowed' : 'text-gray-600'}`}
                  onClick={handleClearAll}
                  disabled={!showClearAllOption}
                >
                  <XIcon />
                  <span className="ml-2 text-sm">Bỏ chọn</span>
                </button>
              ) : (
                <div className="flex items-center px-2">
                  <input
                    checked={option.checked}
                    id={`filter-brand-${optionIdx}`}
                    name="brand"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => option.brand && handleBrandClick(option.brand)}
                  />
                  <label htmlFor={`filter-brand-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default FilterByBrand;
