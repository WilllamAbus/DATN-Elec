import NumericFormat from "../../../../../ultils/numerFormat/numericFormatWrapper";
import { FieldError, Control } from "react-hook-form";
import { Controller } from "react-hook-form";

interface FormInputProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  register: any;
  control: Control<any>; 
  error?: FieldError;
  validation?: any;
  format?: boolean;
  onValueChange?: (values: any) => void;
  suffix?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  placeholder,
  type = "text",
  register,
  control,
  error,
  validation,
  format = false,
  onValueChange,
  suffix = "",
}) => {
  return (
    <div className="col-span-6 sm:col-span-3">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      {format ? (
        <Controller
          name={id}
          control={control} 
          rules={validation}
          render={({ field: { onChange, value } }) => (
            <NumericFormat
              id={id}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              thousandSeparator="."
              decimalSeparator=","
              suffix={suffix}
              value={value}
              onValueChange={(values) => {
                const { floatValue } = values;
                onChange(floatValue);
                if (onValueChange) onValueChange(values);
              }}
            />
          )}
        />
      ) : (
        <input
          type={type}
          id={id}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder={placeholder}
          {...register(id, validation)}
        />
      )}
      {error && (
        <div className="flex items-center mt-2 text-red-600">
          <span className="text-sm font-medium">{error.message}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
