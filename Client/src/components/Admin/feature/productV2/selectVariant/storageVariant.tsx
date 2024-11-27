import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { StylesConfig, SingleValue } from "react-select";
import { AppDispatch, RootState } from "../../../../../redux/store"; 
import { getAllStorageThunk } from "../../../../../redux/product/attributes/Thunk"; 
import { Storage } from "../../../../../services/product_v2/types/attributes/getAllStorage"; 

const storageStyles: StylesConfig<Storage, false> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? "#d3d3d3"
      : isFocused
      ? "#f0f0f0"
      : undefined,
    color: isDisabled ? "#ccc" : isSelected ? "black" : "black",
    cursor: isDisabled ? "not-allowed" : "default",
    ":active": {
      ...styles[":active"],
      backgroundColor: !isDisabled
        ? isSelected
          ? "#d3d3d3"
          : "#e0e0e0"
        : undefined,
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "black",
  }),
  clearIndicator: (styles) => ({
    ...styles,
    color: "black",
    cursor: "pointer",
  }),
};

interface StorageSelectProps {
  onChange: (selectedOption: SingleValue<Storage>) => void;
  value: SingleValue<Storage> | null;
  className?: string;
}

const StorageSelect: React.FC<StorageSelectProps> = ({ onChange, value, className }) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { storages, isLoading } = useSelector((state: RootState) => state.getAttributes.getAllStorage);

  useEffect(() => {
    dispatch(getAllStorageThunk());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const storageOptions = storages.map((storage: Storage) => ({
    ...storage,
    value: storage._id,
    label: storage.name,
  }));

  return (
    <Select
      classNamePrefix="react-select"
      closeMenuOnSelect
      isMulti={false}
      options={storageOptions} 
      styles={storageStyles}
      value={value}
      onChange={onChange}
      className={className}
      isClearable={true}
    />
  );
};

export default StorageSelect;
