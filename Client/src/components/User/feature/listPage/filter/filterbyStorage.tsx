import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { getAllStorageThunk } from '../../../../../redux/product/attributes/Thunk/getAllStorage';
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import XIcon from '../svg/deleteicon';
import { STORAGE, FilterState } from '../../../../../services/clientcate/client/types/getProuctbyCategory';

interface FilterByStorageProps {
  onchange?: (selectedStorages: STORAGE[]) => void;
  filters: FilterState;
}

interface Option {
  value: string;
  label: string;
  checked: boolean;
  storage?: STORAGE;
}

const FilterByStorage: React.FC<FilterByStorageProps> = ({ onchange, filters }) => {
  const dispatch: AppDispatch = useDispatch();
  const storages = useSelector((state: RootState) => state.getAttributes.getAllStorage.storages || []);
  const [selectedStorages, setSelectedStorages] = useState<STORAGE[]>([]);

  useEffect(() => {
    dispatch(getAllStorageThunk());
  }, [dispatch]);

  useEffect(() => {
    if (filters.storage) {
      setSelectedStorages(filters.storage); 
    } else {
      setSelectedStorages([]);
    }
  }, [filters.storage]);

  const handleStorageClick = (storage: STORAGE) => {
    const isSelected = selectedStorages.some((selected) => selected._id === storage._id);
    const newSelectedStorages = isSelected
      ? selectedStorages.filter((selected) => selected._id !== storage._id)
      : [...selectedStorages, storage];
  
    setSelectedStorages(newSelectedStorages);
    if (onchange) {
      onchange(newSelectedStorages);
    }
  };

  const handleClearAll = () => {
    setSelectedStorages([]);
    if (onchange) {
      onchange([]);
    }
  };

  const options: Option[] = [
    { value: 'select-all', label: 'Bỏ chọn tất cả', checked: false },
    ...storages.map((storage) => ({
      value: storage._id,
      label: storage.name,
      checked: selectedStorages.some((selected: STORAGE) => selected._id === storage._id),
      storage: storage,
    })),
  ];

  const showClearAllOption = selectedStorages.length > 0;

  return (
    <Disclosure as="div" className="border-t border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Storage</span>
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
                    id={`filter-storage-${optionIdx}`}
                    name="storage"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => option.storage && handleStorageClick(option.storage)}
                  />
                  <label htmlFor={`filter-storage-${optionIdx}`} className="ml-3 text-sm text-gray-600">
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

export default FilterByStorage;
