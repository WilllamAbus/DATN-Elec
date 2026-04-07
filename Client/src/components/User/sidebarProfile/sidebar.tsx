import React from "react";

import Avatar from "../../../assets/images/avatar.png";
// import "../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
const SidebarProfile: React.FC = () => {
  return (
    <>
      {/* Wrapper */}
      {/* Sidebar */}
      <div className="col-span-3">
        <div className="px-4 py-3 shadow flex items-center gap-4">
          <div className="flex-shrink-0">
            <img
              src={Avatar}
              alt="profile"
              className="rounded-full w-14 h-14 border border-gray-200 p-1 object-cover"
            />
          </div>
          <div className="flex-grow">
            <p className="text-gray-600">Hello,</p>
            <h4 className="text-gray-800 font-medium">EMail</h4>
          </div>
        </div>
        <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
          <div className="space-y-1 pl-8">
            <a
              href="#"
              className="relative text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-regular fa-address-card"></i>
              </span>
              Manage account
            </a>
            <Link
              to="/profile"
              className="relative hover:text-primary block capitalize transition"
            >
              Thông tin cá nhân
            </Link>

            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              Đổi mật khẩu
            </a>
          </div>
          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-solid fa-box-archive"></i>
              </span>
              Cập nhật thông tin
            </a>
          </div>
          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-solid fa-box-archive"></i>
              </span>
              Lịch sử đơn hàng
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              Nhận xét
            </a>
          </div>

          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              Voucher
            </a>
          </div>

          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-regular fa-heart"></i>
              </span>
              Yêu thích
            </a>
          </div>

          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
              Logout
            </a>
          </div>
        </div>
      </div>

      {/* ./sidebar */}
      {/* ./wrapper */}
    </>
  );
};

export default SidebarProfile;
