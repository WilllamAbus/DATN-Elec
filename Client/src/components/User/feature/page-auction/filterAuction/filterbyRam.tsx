import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { getAllRamThunk } from '../../../../../redux/product/attributes/Thunk/getAllRam';
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import XIcon from '../svg/deleteicon';
import { RAM, FilterState } from '../../../../../services/product_v2/client/types/listPageAuction';

interface FilterByRamProps {
  onchange?: (selectedRams: RAM[]) => void;
  filters: FilterState;
}

interface Option {
  value: string;
  label: string;
  checked: boolean;
  ram?: RAM;
}

const FilterByRam: React.FC<FilterByRamProps> = ({ onchange, filters }) => {
  const dispatch: AppDispatch = useDispatch();
  const rams = useSelector((state: RootState) => state.getAttributes.getAllRam.rams || []);
  const [selectedRams, setSelectedRams] = useState<RAM[]>([]);

  useEffect(() => {
    dispatch(getAllRamThunk());
  }, [dispatch]);

  useEffect(() => {
    if (filters.ram && Array.isArray(filters.ram)) {
      setSelectedRams(filters.ram as RAM[]); 
    } else {
      setSelectedRams([]);
    }
  }, [filters.ram]);
  

  const handleRamClick = (ram: RAM) => {
    const isSelected = selectedRams.some((selected) => selected._id === ram._id);
    const newSelectedRams = isSelected
      ? selectedRams.filter((selected) => selected._id !== ram._id)
      : [...selectedRams, ram];
  
    setSelectedRams(newSelectedRams);
    if (onchange) {
      onchange(newSelectedRams);
    }
  };

  const handleClearAll = () => {
    setSelectedRams([]);
    if (onchange) {
      onchange([]);
    }
  };

  const options: Option[] = [
    { value: 'select-all', label: 'Bỏ chọn tất cả', checked: false },
    ...rams.map((ram) => ({
      value: ram._id,
      label: `${ram.name} GB`, 
      checked: selectedRams.some((selected: RAM) => selected._id === ram._id),
      ram: ram,
    })),
  ];

  const showClearAllOption = selectedRams.length > 0;

  return (
    <Disclosure as="div" className="border-t border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">RAM</span>
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
                    id={`filter-ram-${optionIdx}`}
                    name="ram"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => option.ram && handleRamClick(option.ram)}
                  />
                  <label htmlFor={`filter-ram-${optionIdx}`} className="ml-3 text-sm text-gray-600">
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

export default FilterByRam;
