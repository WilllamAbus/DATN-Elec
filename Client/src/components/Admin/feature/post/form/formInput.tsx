import NumericFormat from "../../../../../ultils/numerFormat/numericFormatWrapper"; // Đảm bảo chính xác tên thư mục
import { FieldError, Control, UseFormRegister, RegisterOptions, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

export interface FormValues {
  title?: string;
}

interface FormInputProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<T>;
  control: Control<T>;
  error?: FieldError;
  validation?: RegisterOptions<T, Path<T>>; 
  format?: boolean;
  onValueChange?: (values: { floatValue?: number; formattedValue?: string }) => void;
  suffix?: string;
}

const FormInput = <T extends FormValues>({
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
}: FormInputProps<T>) => {
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
              value={value || ''}
              onValueChange={(values) => {
                const { floatValue } = values;
                onChange(floatValue);
                onValueChange?.(values);
              }}
            />
          )}
        />
      ) : (
        <input
          type={type}
          id={id} // No cast needed
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder={placeholder}
          {...register(id, validation)} // No cast needed
        />
      )}
      {error?.message && (
        <div className="flex items-center mt-2 text-red-600">
          <span className="text-sm font-medium">{error.message}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
