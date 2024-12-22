import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

interface FormSelectProps {
  label: string;
  id: string;
  options: { _id: string; name: string | number }[];
  register: any; // Register from react-hook-form
  validation?: object;
  errorMessage?: string;
  className?: string; // Accept className to pass the styling
  value?: any; // To handle the selected value
  onChange?: (selectedOption: any) => void; // To handle the selection change
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  options,
  register,
  validation,
  errorMessage,
  className,
  value, // Accept the value prop
  onChange, // Accept the onChange prop
}) => {
  // Convert options to the format that react-select expects
  const formattedOptions = options.map((option) => ({
    value: option._id,
    label: String(option.name), // Ensure label is always a string
  }));

  return (
    <div className="col-span-6 sm:col-span-3">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      <Controller
        name={id}
        control={register}
        rules={validation}
        render={({ field }) => (
          <Select
            {...field}
            value={value} // Bind selected value
            onChange={(selectedOption) => {
              field.onChange(selectedOption); // Update react-hook-form field value
              onChange && onChange(selectedOption); // Custom onChange if provided
            }}
            options={formattedOptions}
            className={`react-select ${errorMessage ? "border-red-500" : ""} ${className}`} // Pass the custom className
            placeholder={`Tìm kiếm ${label.toLowerCase()}...`}
          />
        )}
      />

      {errorMessage && (
        <div className="flex items-center mt-2 text-red-600">
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
