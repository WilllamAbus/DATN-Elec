import React from 'react';
import { Alert } from "@material-tailwind/react";

// Define the props interface
interface AlertProps {
  message: string;
  type: "success" | "error" | null;
}

// Define the Icon component
function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Define the AlertCustomStyles component
const AlertCustomStyles: React.FC<AlertProps> = ({ message, type }) => {
  // Define the classes based on the alert type
  const alertClasses = {
    success: "border-[#2ec946] bg-[#2ec946]/10 text-[#2ec946]",
    error: "border-red-500 bg-red-500/10 text-red-500",
    default: "border-gray-500 bg-gray-500/10 text-gray-500"
  };

  return (
    <Alert
      icon={<Icon />}
      className={`rounded-none border-l-4 ${alertClasses[type || 'default']}`}
    >
      {message}
    </Alert>
  );
};

export default AlertCustomStyles;
