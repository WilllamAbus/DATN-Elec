import React, { useEffect, useState } from "react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store";
import { getProfileThunk } from "../../../../redux/auth/authThunk";
import { Link, useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../../../redux/auth/authSlice";
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
      <nav className="container py-4 flex items-center space-x-3 bg-gray-50 rounded-lg shadow-sm">
        <Link to="/" className="text-primary text-lg">
          <i className="fa-solid fa-house"></i>
        </Link>
        <span className="text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">HỒ SƠ KHÁCH HÀNG</p>
      </nav>

      {/* Wrapper */}
      <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">
        {/* Sidebar */}
        <aside className="col-span-3">
          <div className="bg-white shadow-sm rounded-lg p-4">
            <div className="flex items-center gap-4">
              <img
                src={profile?.avatar}
                alt="profile"
                className="rounded-full w-16 h-16 border-2 border-gray-200 p-1 object-cover"
              />
              <div>
                <p className="text-gray-600">Hello,</p>
                <h4 className="text-gray-800 font-semibold">{profile?.name}</h4>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow-sm rounded-lg p-4 divide-y divide-gray-200">
            <nav className="space-y-4">
              <a
                href="#"
                className={`relative text-base block font-medium capitalize transition ${
                  view === "info" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("info")}
              >
                <i className="fa-regular fa-address-card mr-2"></i>
                Quản lý tài khoản
              </a>
              <a
                href="#"
                className={`relative text-base block capitalize transition ${
                  view === "password" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("password")}
              >
                <i className="fa-solid fa-key mr-2"></i>
                Đổi mật khẩu
              </a>
              <a
                href="#"
                className={`relative text-base block capitalize transition ${
                  view === "edit" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("edit")}
              >
                <i className="fa fa-edit mr-2"></i>
                Cập nhật thông tin
              </a>
              <Link
                to="/listCart"
                className="relative text-base block font-medium capitalize text-gray-600 transition hover:text-primary"
              >
                <i className="fa-solid fa-box-archive mr-2"></i>
                Lịch sử đơn hàng
              </Link>
              <a
                href="#"
                className="relative text-base block capitalize text-gray-600 transition hover:text-primary"
              >
                <i className="fa-regular fa-heart mr-2"></i>
                Yêu thích
              </a>
              <a
                href="#"
                className="relative text-base block font-medium capitalize text-gray-600 transition hover:text-primary"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket mr-2"></i>
                Đăng Xuất
              </a>
            </nav>
          </div>
        </aside>

        {/* Info */}
        <section className="col-span-9 bg-white shadow-sm rounded-lg p-6">
          {view === "info" && <Info profiles={profile} />}
          {view === "edit" && <EditProfile profile={profile} />}
          {view === "password" && <UpdatePassword profile={profile} />}
        </section>
      </div>
    </>
  );
};

export default ProfileUse;
