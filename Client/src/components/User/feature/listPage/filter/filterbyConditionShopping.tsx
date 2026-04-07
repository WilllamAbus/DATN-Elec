import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { getAllConditionShoppingThunk } from '../../../../../redux/product/client/Thunk';
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import XIcon from '../svg/deleteicon';
import { ProductCondition, FilterState } from '../../../../../services/clientcate/client/types/getProuctbyCategory';
interface FilterByConditionShoppingProps {
  onchange?: (conditionShoppings: ProductCondition[]) => void;
  filters: FilterState;
}
interface Option {
  value: string;
  label: string;
  checked: boolean;
  condition?: ProductCondition;
}
const FilterByConditionShopping: React.FC<FilterByConditionShoppingProps> = ({ onchange, filters }) => {
  const dispatch: AppDispatch = useDispatch();
  const conditionShoppings = useSelector((state: RootState) => state.productClient.getAllConditionShoppingPageAuction.conditionShopping || []);
  const [selectedConditions, setSelectedConditions] = useState<ProductCondition[]>([]);
  useEffect(() => {
    dispatch(getAllConditionShoppingThunk());
  }, [dispatch]);

  useEffect(() => {
    if (filters.conditionShopping) {
      setSelectedConditions(filters.conditionShopping);
    } else {
      setSelectedConditions([]);
    }
  }, [filters.conditionShopping]); 
  const handleConditionShoppingClick = (condition: ProductCondition) => {
    const isSelected = selectedConditions.some((selected: ProductCondition) => selected._id === condition._id);
    const newSelectedConditions = isSelected
      ? selectedConditions.filter((selected: ProductCondition) => selected._id !== condition._id)
      : [...selectedConditions, condition];

    setSelectedConditions(newSelectedConditions);

    if (onchange) {
      onchange(newSelectedConditions);
    }
  };

  const handleClearAll = () => {
    setSelectedConditions([]);
    if (onchange) {
      onchange([]);
    }
  };
  const options: Option[] = [
    { value: 'select-all', label: 'Bỏ chọn tất cả', checked: false },
    ...conditionShoppings.map((conditionShopping) => ({
      value: conditionShopping._id,
      label: conditionShopping.nameCondition,
      checked: selectedConditions.some((condition: ProductCondition) => condition._id === conditionShopping._id),
      condition: conditionShopping,
    })),
  ];
  const showClearAllOption = selectedConditions.length > 0;
  return (
    <Disclosure as="div" className="border-t border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Điều kiện mua sắm</span>
          <span className="ml-6 flex items-center">
            <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
            <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div className="space-y-4">
          {options.map((option, optionIdx) => (
            <div key={option.value ?? `null-option-${optionIdx}`} className="flex items-center px-2">
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
                    id={`filter-condition-${optionIdx}`}
                    name="conditionShopping[]"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => option.condition && handleConditionShoppingClick(option.condition)}
                  />
                  <label htmlFor={`filter-condition-${optionIdx}`} className="ml-3 text-sm text-gray-600">
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
export default FilterByConditionShopping;
