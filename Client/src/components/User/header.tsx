import React from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link from react-router-dom
import logo from '../../assets/images/logo.svg'; // Adjust path to your logo image
import dropOneHeader from "../../assets/images/icons/gpu-svgrepo-com.svg"
import dropTwoHeader from "../../assets/images/icons/3d-printer-tool.svg"
const Header:  React.FC = () => {
  // State to control dropdown visibility


  return (
    <header className="py-4 shadow-sm bg-white">
      <div className="container flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-40" />
        </Link>

        <div className="w-full max-w-xl relative flex">
          <span className="absolute left-4 top-3 text-lg text-gray-400">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            name="search"
            id="searchTerm"
            className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none"
            placeholder="Yêu cầu của bạn"
          />
          <button
            type="submit"
            className="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition"
          >
          Tìm
          </button>
        </div>

        <div className="flex items-center space-x-4">
              {/* Notification dropdown */}
          <Link to="#" className="text-center text-gray-700   hover:text-primary px-8 py-4  cursor-pointer relative group">
                    <div className="text-2xl">
                    <i className="fa-regular fa-bell"></i>
                    </div>
                    <div className="text-xs leading-3">Thông báo</div>

                    {/* dropdown */}
                    <div className="absolute
                     w-full left-0 
                     top-full bg-white
                      shadow-md py-3
                       divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100 
                       transition duration-300 invisible group-hover:visible">
                        <a href="#" className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
                            <img src={dropOneHeader} alt="sofa" className="w-5 h-5 object-contain" />
                            <span className="ml-6 text-gray-600 text-sm">Graphic Card</span>
                        </a>
                        <a href="#" className="flex items-center px-6 py-3 hover:bg-gray-100 transition">
                            <img src={dropTwoHeader} alt="terrace" className="w-5 h-5 object-contain" />
                            <span className="ml-6 text-gray-600 text-sm">3D Printer Set</span>
                        </a>
                
                    </div>
            </Link>
          <Link
            to="#"
            className="text-center text-gray-700 hover:text-primary relative"
          >
            <div className="text-2xl">
              <i className="fa-regular fa-heart"></i>
            </div>
            <div className="text-xs leading-3">Yêu thích</div>
            <div className="absolute 
            right-0 -top-1 w-5 h-5 
            rounded-full flex items-center justify-center bg-primary text-white text-xs">
              8
            </div>
          </Link>

        
          {/* <div className="relative  ">
            <Link
              to="#"
              className="text-center text-gray-700 hover:text-primary "
              onClick={toggleDropdown}
            >
              <div className="text-2xl">
                <i className="fa-regular fa-bell"></i>
              </div>
              <div className="text-xs leading-3">Notification</div>
              <div
                className={`absolute right-0 -top-1 w-40 rounded-md mt-2 bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed opacity-0 ${
                  isDropdownOpen ? 'visible' : 'invisible'
                }`}
              >
                <a
                  href="#"
                  className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
                >
                  <img
                    src="../../assets/images/icons/sofa.svg"
                    alt="sofa"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="ml-2 text-gray-600 text-sm">Sofa</span>
                </a>
                <a
                  href="#"
                  className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
                >
                  <img
                    src="../../assets/images/icons/terrace.svg"
                    alt="terrace"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="ml-2 text-gray-600 text-sm">Terrace</span>
                </a>
                <a
                  href="#"
                  className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
                >
                  <img
                    src="../../assets/images/icons/bed.svg"
                    alt="bed"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="ml-2 text-gray-600 text-sm">Giường</span>
                </a>
              </div>
            </Link>
          </div> */}

          <Link
            to="/cart"
            className="text-center text-gray-700 hover:text-primary relative"
          >
            <div className="text-2xl">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="text-xs leading-3">Giỏ hàng</div>
            <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
              2
            </div>
          </Link>

          <Link
            to="/profile"
            className="text-center text-gray-700 hover:text-primary relative"
          >
            <div className="text-2xl">
              <i className="fa-regular fa-user"></i>
            </div>
            <div className="text-xs leading-3">Tài khoản</div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
