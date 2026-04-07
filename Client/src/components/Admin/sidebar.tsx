import React from "react";
import DropdownItem from "../../ultils/dropdown/admin/sidebar";
import NavItem from "../../ultils/dropdown/admin/sidebar/LinkDropdownSiderbar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { logoutThunk } from "../../redux/auth/authThunk";
import Cookies from "js-cookie";

interface SidebarProps {
  isOpenMobie: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpenMobie, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpenMobie ? "opacity-100" : "opacity-0 pointer-events-none"
        } z-10`}
        onClick={onClose}
      />
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 ${
          isOpenMobie ? "block" : "hidden"
        } w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width`}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <ul className="pb-2 space-y-2">
                <li>
                  <form action="#" method="GET" className="lg:hidden">
                    <label htmlFor="mobile-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-500"
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
                      </div>
                      <input
                        type="text"
                        name="email"
                        id="mobile-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Search"
                      />
                    </div>
                  </form>
                </li>
                <NavItem type="homeAdmin" />
                <DropdownItem type="product" />
                <DropdownItem type="orderCart" />
                <DropdownItem type="account" />
                <DropdownItem type="categories" />
                <DropdownItem type="attribute" />
                <DropdownItem type="post" />
                <NavItem type="comment" />
                <NavItem type="supplier" />
                <NavItem type="brand" />
                <DropdownItem type="inbound" />
                <DropdownItem type="auctions" />
              </ul>
              <div className="pt-2 space-y-2">
                <ul className="pb-2 space-y-2">
                  <DropdownItem type="recycleBin" />
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      aria-controls="dropdown-auth"
                      data-collapse-toggle="dropdown-auth"
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                        />
                      </svg>

                      <span
                        className="flex-1 ml-3 text-left whitespace-nowrap"
                        sidebar-toggle-item=""
                      >
                        Đăng xuất
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
