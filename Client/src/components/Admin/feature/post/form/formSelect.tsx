import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface FormSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>; 
  options: { _id: string; name: string }[];
  register: UseFormRegister<T>;
  validation?: object;
  errorMessage?: string;
}

const FormSelect = <T extends FieldValues>({
  label,
  id,
  options,
  register,
  validation,
  errorMessage,
}: FormSelectProps<T>) => {
  return (
    <div className="col-span-6 sm:col-span-3">
      <label htmlFor={id as string} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <select
        id={id as string}
        className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        {...register(id, validation)} 
      >
        <option value="">Chọn {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {errorMessage && (
        <div className="flex items-center mt-2 text-red-600">
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
