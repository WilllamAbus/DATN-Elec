import React from "react";

interface ToggleSwitchFormProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
  name: string;
  register: any;
}

const ToggleSwitchForm: React.FC<ToggleSwitchFormProps> = ({
  checked,
  onChange,
  label,
  className,
  name,
  register,
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          {...register(name)}
          checked={checked}
          onChange={onChange}
          className="form-checkbox"
        />
        <span className="ml-2">{label}</span>
      </label>
    </div>
  );
};

export default ToggleSwitchForm;
