import React, { useState } from "react";

interface DropdownProps {
  items: { label: string; href: string }[];
  buttonText: string;
}

const DropdownNav: React.FC<DropdownProps> = ({ items, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className="relative list-none">
      <button
        onClick={toggleDropdown}
        className="flex justify-between items-center py-2 pr-4 pl-3 w-full font-medium text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
      >
        {buttonText}{" "}
        <svg
          className="hidden sm:flex w-4 h-4 text-gray-900 dark:text-white ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-44 bg-primary_flowbite-901 rounded shadow-lg dark:bg-gray-700 z-20">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-400">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default DropdownNav;
