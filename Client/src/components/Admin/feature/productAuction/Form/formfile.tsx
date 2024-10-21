import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => {
  return (
    <div className="col-span-3 1sm:col-span-3">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      {children}
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
};

export default FormField;
