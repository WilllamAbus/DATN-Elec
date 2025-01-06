import { useState } from 'react';

const useNumberFormat = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formattedValue = e.target.value.replace(/\D/g, '');
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setValue(formattedValue);
  };

  return {
    value,
    handleChange,
  };
};

export default useNumberFormat;
