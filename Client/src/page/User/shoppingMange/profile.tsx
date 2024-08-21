import React, { useEffect, useState } from "react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store";
import { getProfileThunk } from "../../../redux/auth/authThunk";
import { Link, useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../../redux/auth/authSlice";
import EditProfile from "./edit-profile";
import Info from "./info";
import UpdatePassword from "./changePassword";

const ProfileUse: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState<"info" | "edit" | "password">("info");

  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );
  const profileStatus = useAppSelector(
    (state: RootState) => state.auth.profile.status
  );
  const profileError = useAppSelector(
    (state: RootState) => state.auth.profile.error
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getProfileThunk());
    } else {
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (profileStatus === "succeeded" && profile) {
      const profileData = {
        name: profile.name || "",
        address: profile.address || "",
        phone: profile.phone || "",
        roles: profile.roles || [],
        birthday: profile.birthday || "",
      };
      localStorage.setItem("userProfile", JSON.stringify(profileData));
    }
  }, [profile, profileStatus]);

  if (profileStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (profileStatus === "failed") {
    return <p>Error: {profileError || "Unknown error occurred"}</p>;
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutAction());
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("roles");
      localStorage.removeItem("userProfile");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <Link to="/" className="text-primary text-base">
          <i className="fa-solid fa-house"></i>
        </Link>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">HỒ SƠ KHÁCH HÀNG</p>
      </div>

      {/* Wrapper */}
      <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="px-4 py-3 shadow flex items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={profile?.avatar}
                alt="profile"
                className="rounded-full w-14 h-14 border border-gray-200 p-1 object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="text-gray-600">Hello,</p>
              <h4 className="text-gray-800 font-medium">{profile?.name}</h4>
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
                Quản lý tài khoản
              </a>
              <a
                href="#"
                className={`relative hover:text-primary block capitalize transition ${
                  view === "info" ? "text-primary" : ""
                }`}
                onClick={() => setView("info")}
              >
                Thông tin cá nhân
              </a>
              <a
                href="#"
                className={`relative hover:text-primary block capitalize transition ${
                  view === "password" ? "text-primary" : ""
                }`}
                onClick={() => setView("password")}
              >
                Đổi mật khẩu
              </a>
            </div>

            <div className="space-y-1 pl-8 pt-4">
              <a
                href="#"
                className={`relative hover:text-primary block capitalize transition ${
                  view === "edit" ? "text-primary" : ""
                }`}
                onClick={() => setView("edit")}
              >
                <span className="absolute -left-8 top-0 text-base">
                  <i className="fa fa-address-card"></i>
                </span>
                Cập nhật thông tin
              </a>
            </div>
            <div className="space-y-1 pl-8 pt-4">
              <Link
                to="/listCart"
                className="relative hover:text-primary block font-medium capitalize transition"
              >
                <span className="absolute -left-8 top-0 text-base">
                  <i className="fa-solid fa-box-archive"></i>
                </span>
                Lịch sử đơn hàng
              </Link>

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
                className="relative hover:text-primary block font-medium capitalize transition"
              >
                <span className="absolute -left-8 top-0 text-base">
                  <i className="fa-regular fa-credit-card"></i>
                </span>
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
                onClick={handleLogout}
              >
                <span className="absolute -left-8 top-0 text-base">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </span>
                Đăng Xuất
              </a>
            </div>
          </div>
        </div>
        {/* ./sidebar */}
        {/* Info */}
        {view === "info" && <Info profiles={profile} />}
        {view === "edit" && <EditProfile profile={profile} />}
        {view === "password" && <UpdatePassword profile={profile} />}

        {/* ./info */}
      </div>

    </>
  );
};

export default ProfileUse;
