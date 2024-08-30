import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoAdmin from "../../../../assets/images/icons/userAmin.png";

const adminDropdownToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdownAdmin = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, toggleDropdownAdmin };
};

const AdminMenuDropdown: React.FC = () => {
  const { isOpen, toggleDropdownAdmin } = adminDropdownToggle();

  return (
    <div className="relative">
      <button
        type="button"
        className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 flex-shrink-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="userMenuDropdownButton"
        aria-expanded={isOpen}
        onClick={toggleDropdownAdmin}
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 rounded-full"
          src={LogoAdmin}
          alt="user photo"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
          id="userMenuDropdown"
        >
          {/* <div className="px-4 py-3" role="none">
            <p className="text-sm text-gray-900 dark:text-white" role="none">
              Hậu
            </p>
            <p
              className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
              role="none"
            >
              haudppc07506@fpt.edu.vn
            </p>
          </div> */}
          <ul
            className="py-1 font-light text-gray-500 dark:text-gray-400"
            aria-labelledby="userMenuDropdownButton"
          >
            <li>
              <Link
                to="/"
                className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12l9-9 9 9-1.5 1.5L12 5.5 4.5 13.5V19.5a1.5 1.5 0 001.5 1.5h3V16.5A1.5 1.5 0 0110.5 15h3A1.5 1.5 0 0115 16.5v4.5h3a1.5 1.5 0 001.5-1.5v-6z" />
                </svg>

                <span className="ml-1 font-bold">Về trang chủ</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminMenuDropdown;
