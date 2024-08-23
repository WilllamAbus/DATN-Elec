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
        <img className="w-8 h-8 rounded-full" src={LogoAdmin} alt="user photo" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
          id="userMenuDropdown"
        >
          <div className="px-4 py-3" role="none">
            <p className="text-sm text-gray-900 dark:text-white" role="none">
              Hậu
            </p>
            <p
              className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
              role="none"
            >
              haudppc07506@fpt.edu.vn
            </p>
          </div>
          <ul
            className="py-1 font-light text-gray-500 dark:text-gray-400"
            aria-labelledby="userMenuDropdownButton"
          >

            <li>
              <Link
                to="/login"
                className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>

                <span className="ml-1 font-bold">Cập nhật</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminMenuDropdown;
