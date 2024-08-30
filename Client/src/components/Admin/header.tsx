import React, { useState } from "react";
import Avatar from "../../assets/images/avatar.png";
import { logoutThunk } from "../../redux/auth/authThunk";
import Cookies from "js-cookie";
import { useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };
  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();

      Cookies.remove("token");
      Cookies.remove("refreshToken");
      localStorage.removeItem("userProfile");

      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
      <div className="w-1/2"></div>
      <div className="relative w-1/2 flex justify-end">
        <button
          onClick={toggleDropdown}
          className="relative z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
        >
          <img src={Avatar} alt="Profile" />
        </button>
        {isOpen && (
          <button
            onClick={closeDropdown}
            className="h-full w-full fixed inset-0 cursor-default"
          ></button>
        )}
        {isOpen && (
          <div className="absolute w-32 bg-white rounded-lg shadow-lg py-2 mt-16">
            <a
              href="#"
              className="block px-4 py-2 account-link hover:text-black"
            >
              Tài khoản
            </a>
            <a
              href="#"
              className="block px-4 py-2 account-link hover:text-black"
            >
              Hỗ trợ
            </a>
            <a
              onClick={handleLogout}
              className="block px-4 py-2 account-link hover:text-black"
            >
              Đăng xuất
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
