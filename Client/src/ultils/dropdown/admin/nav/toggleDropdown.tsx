import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoAdmin from "../../../../assets/images/icons/userAmin.png";
import { RootState, useAppSelector } from "../../../../redux/store";
import { Transition } from "@headlessui/react";

const adminDropdownToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdownAdmin = () => {
    setIsOpen(!isOpen);
  };
  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );

  const avatar = profile?.avatar;

  return { isOpen, toggleDropdownAdmin, avatar };
};

const AdminMenuDropdown: React.FC = () => {
  const { isOpen, toggleDropdownAdmin, avatar } = adminDropdownToggle();

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
          src={avatar ? avatar : LogoAdmin}
          alt="user photo"
        />
      </button>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-[-10%]"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-[-10%]"
      >
        <div
          className="absolute right-0 mt-2 z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
          id="userMenuDropdown"
        >
          <ul
            className="py-1 font-light text-gray-500 dark:text-gray-400"
            aria-labelledby="userMenuDropdownButton"
          >
            <li>
              <Link
                to="/"
                className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <i className="iconify mdi--home w-5 h-5"></i>

                <span className="ml-1 font-bold">Về trang chủ</span>
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
};

export default AdminMenuDropdown;
