import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface DropdownProps {
  icon: ReactNode;
  label: string;
  links: Array<{ label: string; to: string }>;
}
function Dropdown({ icon, label, links }: DropdownProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <li>
      <button
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-controls="dropdown"
        data-collapse-toggle="dropdown"
        onClick={toggleDropdown}
      >
        {icon}
        <span className="flex-1 ml-3 text-left whitespace-nowrap">{label}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <ul className={`space-y-2 py-2 ${isDropdownOpen ? "" : "hidden"}`}>
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.to}
              className={`text-base text-gray-900 rounded-lg flex items-center p-2 group hover:bg-gray-100 transition duration-75 pl-11 dark:text-gray-200 dark:hover:bg-gray-700
                ${location.pathname === link.to ? "bg-gray-100 dark:bg-gray-700" : ""}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default Dropdown;
