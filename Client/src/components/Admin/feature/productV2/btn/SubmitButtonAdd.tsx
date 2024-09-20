
import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; 
}
const SubmitButtonAdd: React.FC<SubmitButtonProps> = ({ isLoading, onClick }) => (
  <button
    type="submit"
    className={`text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${
      isLoading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={isLoading}
    onClick={onClick}
  >
    {isLoading ? (
      <div className="flex items-center">
        <svg
          className="animate-spin mr-2 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        Đang thêm...
      </div>
    ) : (
      "Thêm sản phẩm"
    )}
  </button>
);

export default SubmitButtonAdd;
