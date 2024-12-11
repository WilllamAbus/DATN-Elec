import React, { useState, useEffect } from "react";
import "flowbite";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../../ultils/dropdown/client/nav/dropdown.LogoUser.nav";
import UserMenuDropdown from "../../ultils/dropdown/client/nav/toggleDropdown";
import { listCateNavItemThunk } from "../../redux/clientcate/client/Thunk/";
import logoNav from "../../assets/images/logoHeader/logo.svg";
import { useAppDispatch } from "../../redux/rootReducer";
import cateDropdownItems from "./listCateNav/path/hookspathnav";
import { searchProduct } from "../../services/product_v2/client/homeAllProduct";
import { Drawer, Sidebar } from "flowbite-react";


const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listCateNavItemThunk());
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const dropdownItems = cateDropdownItems();

  const dataSearch = async (keyword: string) => {
    if (keyword.length < 2) {
      setFilteredProducts([]);
      return;
    }

    try {
      const result = await searchProduct(keyword);
      const filtered = result.data.filter((product: any) =>
        product.product_name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    dataSearch(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && keyword.length < 2) {
      event.preventDefault();
    }
  };

  const handleSubmit = () => {
    const trimmedKeyword = keyword.trim();
    const encodedKeyword = encodeURIComponent(trimmedKeyword);
    if (encodedKeyword) {
      navigate(`/search/${encodedKeyword}`);
    }
  };

  return (
    <header>
      <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-2 px-4">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <div className="flex justify-start items-center">
            <a href="/" className="flex">
              <img src={logoNav} className="mr-3 h-8" />
              <span className="self-center hidden sm:flex text-2xl font-semibold whitespace-nowrap dark:text-white">
                E-Com
              </span>
            </a>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 ml-14">
              <ul className="flex flex-col mt-4 space-x-6 text-sm font-medium lg:flex-row xl:space-x-8 lg:mt-0">
                <span className="hidden sm:flex">
                  <Dropdown buttonText="Danh mục" items={dropdownItems} />
                </span>
                <li>
                  <Link
                    to="auction"
                    className="block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Đấu giá
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <form className="" onSubmit={handleSubmit}>
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
                id="topbar-search"
                className="bg-gray-50 border sm:w-[100px] border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-2 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Tìm kiếm sản phẩm"
                value={keyword}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Render filtered products */}
            {filteredProducts.length > 0 && (
              <div className="bg-gray-50 border border-gray-300 text-gray-900 md:w-[510px] w-[210px] sm:text-sm rounded-lg shadow-lg pl-2 p-1 absolute mt-0">
                {filteredProducts.map((result) => (
                  <div
                    key={result.id}
                    onClick={() =>
                    (window.location.href = `/search/${encodeURIComponent(
                      result.product_name
                    )}`)
                    } // Điều hướng tới trang sản phẩm
                    className="border border-gray-300 rounded w-full pl-2 p-1 mb-1 text-gray-900 dark:text-white cursor-pointer"
                  >
                    {result.product_name}
                  </div>
                ))}
              </div>
            )}
          </form>

          <div className="flex justify-between items-center lg:order-2">
            <UserMenuDropdown />
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              id="toggleMobileMenuButton"
              data-collapse-toggle="toggleMobileMenu"
              className="items-center p-2 text-gray-500 rounded-lg md:ml-2 lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="#000000"
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

          <Drawer open={isOpen} onClose={handleClose}>
            <Drawer.Header title="MENU" titleIcon={() => <></>} />
            <Drawer.Items>
              <Sidebar
                aria-label="Sidebar with multi-level dropdown example"
                className="[&>div]:bg-transparent [&>div]:text-gray-900 [&>div]:dark:text-gray-200 [&>div]:text-sm [&>div]:space-y-1"
              >
                <Link
                  to="/"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Trang chủ
                </Link>

                <Dropdown buttonText="Danh mục" items={dropdownItems} />

                <Link
                  to="/auction"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Đấu giá
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to="/login"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Đăng ký
                </Link>

                <Link
                  to="/checkout"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Giỏ hàng
                </Link>


              </Sidebar>
            </Drawer.Items>
          </Drawer>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
