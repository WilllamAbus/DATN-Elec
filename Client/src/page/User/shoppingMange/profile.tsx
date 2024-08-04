import React, { useEffect, useState } from "react";
import UserHeader from "../../../components/User/header";
import UserNav from "../../../components/User/navbar";
import UserFooter from "../../../components/User/footer";
import UserCoppyright from "../../../components/User/copyright";
import { Link } from "react-router-dom";
import Avatar from "../../../assets/images/avatar.png";
import "../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { getProfile, logout } from "../../../services/authentication/auth.services";

import type { UserProfile } from "../../../types/user";
import { useNavigate } from "react-router-dom";
import EditProfile from "./edit-profile";
import Info from "./info";
import { useCookies } from "react-cookie";
// interface UserProfile {
//   name: string;
//   email: string;
//   birthday: string;
//   gender: string;
//   phone: string;
// }
// interface info {
//   profile: UserProfile;
// }

const ProfileUse: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cookies,, removeCookie] = useCookies(["token", "role"]);
  const [view, setView] = useState<"info" | "edit">("info");
  // useEffect(() => {
  //   getUserInfo();
  // }, []);
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookies.token) {
      navigate("/login");
    } else {
      getUserInfo();
    }
  }, [cookies, navigate]);

  const getUserInfo = async () => {
    try {
      const res = await getProfile();
      setProfile(res);
    } catch (err) {
      console.log("err === ", err);
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      removeCookie("token");
      removeCookie("role");

      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  if (!profile) return <p>Loading...</p>;

  return (
    <>
      <UserHeader />
      <UserNav />
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

      <p>
        <strong>Status:</strong> {profile.roles}
      </p>
      {/* ./breadcrumb */}

      {/* Wrapper */}
      <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">
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
              <h4 className="text-gray-800 font-medium">{profile.name}</h4>
            </div>
          </div>
          <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
            <div className="space-y-1 pl-8">
              <a href="#" className="relative text-primary block font-medium capitalize transition">
                <span className="absolute -left-8 top-0 text-base">
                  <i className="fa-regular fa-address-card"></i>
                </span>
                Manage account
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
              <a href="#" className="relative hover:text-primary block capitalize transition">
                Manage addresses
              </a>
              <a href="#" className="relative hover:text-primary block capitalize transition">
                Change password
              </a>
            </div>

            <div className="space-y-1 pl-8 pt-4">
              <a
                href="#"
                className={`relative hover:text-primary block capitalize transition ${
                  view === "info" ? "text-primary" : ""
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
              <a
                href="#"
                className="relative hover:text-primary block font-medium capitalize transition"
              >
                <span className="absolute -left-8 top-0 text-base">
                  <i className="fa-solid fa-box-archive"></i>
                </span>
                Lịch sử đơn hàng
              </a>

              <a href="#" className="relative hover:text-primary block capitalize transition">
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
                Logout
              </a>
            </div>
          </div>
        </div>
        {/* ./sidebar */}
        {/* Info */}
        {view === "info" && <Info profiles={profile} />}
        {view === "edit" && <EditProfile profile={profile} />}
        {/* ./info */}
      </div>
      {/* ./wrapper */}
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default ProfileUse;
