import React, { useState, useEffect } from "react";
import "flowbite";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../../ultils/dropdown/client/nav/dropdown.LogoUser.nav";
import UserMenuDropdown from "../../ultils/dropdown/client/nav/toggleDropdown";
import { listCateNavItemThunk } from "../../redux/clientcate/client/Thunk/";
import logoNav from "../../assets/images/logoHeader/logo.svg";
import { useAppDispatch } from "../../redux/rootReducer";
import cateDropdownItems from './listCateNav/path/hookspathnav';
const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [keyword, setSearchTerm] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(listCateNavItemThunk());
  }, [dispatch]);
  const dropdownItems = cateDropdownItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      console.log("Vui lòng nhập từ khóa tìm kiếm");
    }
  };

  return (
    <header>
      <nav className="fixed z-30 w-full bg-primary-900 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-2 px-4">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <div className="flex justify-start items-center">
            <a href="/" className="flex mr-14">
              <img src={logoNav} className="mr-3 h-8" />
              <span className="self-center hidden sm:flex text-2xl font-semibold whitespace-nowrap dark:text-white">
                E-Com
              </span>
            </a>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
              <ul className="flex flex-col mt-4 space-x-6 text-sm font-medium lg:flex-row xl:space-x-8 lg:mt-0">
                <span className="hidden sm:flex">
                  <Dropdown buttonText="Danh mục" items={dropdownItems} />
                </span>
                <li>
                  <Link
                    to="allList"
                    className="block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li>
                <Link
                    to="auction"
                    className="block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Đấu giá
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Sự kiện
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <form onSubmit={handleSearch} className="hidden lg:block lg:pl-3.5">
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1 lg:w-[32rem]">
              <div className="absolute inset-y-0 right-2 flex items-center pl-3 pointer-events-none">
                <button type="submit">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                name="email"
                id="topbar-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-2 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nhập từ khóa tìm kiếm"
                value={keyword}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <div className="flex justify-between items-center lg:order-2">
            <UserMenuDropdown />
            <button
              type="button"
              id="toggleMobileMenuButton"
              data-collapse-toggle="toggleMobileMenu"
              className="items-center p-2 text-gray-500 rounded-lg md:ml-2 lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <nav className="bg-white dark:bg-gray-900">
        <ul
          id="toggleMobileMenu"
          className="hidden flex-col mt-0 pt-16 w-full text-sm font-medium lg:hidden"
        >
          <li className="block border-b dark:border-gray-700">
            <a
              href="#"
              className="block py-3 px-4 text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
              aria-current="page"
            >
              Home
            </a>
          </li>
          <li className="block border-b dark:border-gray-700">
            <a
              href="#"
              className="block py-3 px-4 text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
            >
              Messages
            </a>
          </li>
          <li className="block border-b dark:border-gray-700">
            <a
              href="#"
              className="block py-3 px-4 text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
            >
              Profile
            </a>
          </li>
          <li className="block border-b dark:border-gray-700">
            <a
              href="#"
              className="block py-3 px-4 text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
            >
              Settings
            </a>
          </li>
          <li className="block border-b dark:border-gray-700">
            <button
              type="button"
              data-collapse-toggle="dropdownMobileNavbar"
              className="flex justify-between items-center py-3 px-4 w-full text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
            >
              Dropdown{" "}
              <svg
                className="w-6 h-6 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <ul id="dropdownMobileNavbar" className="hidden">
              <li className="block border-t border-b dark:border-gray-700">
                <a
                  href="#"
                  className="block py-3 px-4 text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
                >
                  Item 1
                </a>
              </li>
              <li className="block border-b dark:border-gray-700">
                <a
                  href="#"
                  className="block py-3 px-4 text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
                >
                  Item 2
                </a>
              </li>
              <li className="block">
                <a
                  href="#"
                  className="block py-3 px-4 text-gray-900 lg:py-0 dark:text-white lg:hover:underline lg:px-0"
                >
                  Item 3
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
