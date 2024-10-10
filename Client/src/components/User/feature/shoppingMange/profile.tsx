import React, { useEffect, useState } from "react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { logoutThunk } from "../../../../redux/auth/authThunk";
import EditProfile from "./edit-profile";
import Info from "./info";
import Watchlist from "./wathlist";
import UpdatePassword from "./changePassword";
import CountrySelector from "./address";
import OrderList from "./order";
import OrderAuct from "./orderAuctStatus"
import useAuth from "../../../../hooks/useAuth";

import Cookies from "js-cookie";
import { fetchUserOrdersThunk } from "../../../../redux/order/orderThunks";
const ProfileUse: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState<
    "order"|"orderAuct" | "info" | "edit" | "address" | "password" | "watchlist" | "detail"
  >("info");

  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );
  const profileStatus = useAppSelector(
    (state: RootState) => state.auth.profile.status
  );
  const profileError = useAppSelector(
    (state: RootState) => state.auth.profile.error
  );
  const [, setAddress] = useState<string>("");
  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);
  (newAddress: string) => {
    setAddress(newAddress);
  };
  useAuth();

  if (profileStatus === "failed") {
    return <p>Error: {profileError || "Unknown error occurred"}</p>;
  }
  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();

      Cookies.remove("token");
      Cookies.remove("refreshToken");

      navigate("/login", { replace: true });
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
                <p className="text-gray-600">Xin chào,</p>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Quản lý tài khoản
              </a>
              <a
                href="#"
                className={`relative text-base block capitalize transition ${
                  view === "password" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("password")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C9.243 2 7 4.243 7 7v2H6c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm-5 7h10v2H7V9zm5-5c1.654 0 3 1.346 3 3v2H9V7c0-1.654 1.346-3 3-3z" />
                </svg>
                Đổi mật khẩu
              </a>
              <a
                href="#"
                className={`relative text-base block capitalize transition ${
                  view === "edit" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("edit")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 17.93V15h-2v5h5v-2H11zM14 11v-1.414l-6.707 6.707L7 18h2l5-5V11z" />
                </svg>
                Cập nhật thông tin
              </a>
              <a
                href="#"
                className={`relative text-base block capitalize transition ${
                  view === "address" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("address")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.136 2 5 5.136 5 9c0 3.174 3.614 7.702 6.238 10.794a1 1 0 0 0 1.524 0C15.386 16.703 19 12.174 19 9c0-3.864-3.136-7-7-7zm0 9c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z" />
                </svg>
                Địa chỉ
              </a>
              <a
                href="#"
                className={`relative text-base block capitalize transition ${
                  view === "order" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("order")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 7H2V5h20v2zM7 11H5v10h2V11zm4 0H9v10h2V11zm4 0h-2v10h2V11zm4 0h-2v10h2V11z" />
                </svg>
                Đơn hàng
              </a>
              <a
                href="#"
                className={`relative text-base block capitalize transition ${
                  view === "edit" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setView("orderAuct")}
              >
             <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 7H2V5h20v2zM7 11H5v10h2V11zm4 0H9v10h2V11zm4 0h-2v10h2V11zm4 0h-2v10h2V11z" />
                </svg>
                Đơn hàng đấu giá
              </a>
              <a
                href="#"
                className="relative text-base block capitalize text-gray-600 transition hover:text-primary"
                onClick={() => setView("watchlist")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Yêu thích
              </a>
              <a
                href="#"
                className="relative text-base block font-medium capitalize text-gray-600 transition hover:text-primary"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 3h-2v10h2V3zm-7.293.707l-1.414 1.414L10.586 10H16v2h-5.414l-6.293 6.293 1.414 1.414L13.414 12H18V8h-4.586L5.707 3.707z" />
                </svg>
                Đăng Xuất
              </a>
            </nav>
          </div>
        </aside>

        {/* Info */}
        <section className="col-span-9 bg-white shadow-sm rounded-lg p-6">
          {view === "info" && <Info profiles={profile} />}
          {view === "edit" && <EditProfile profile={profile} />}
          {view === "address" && (
            <CountrySelector
              address={profile?.address || ""}
              onAddressChange={() => {}}
              profile={profile}
            />
          )}
          {view === "password" && <UpdatePassword profile={profile} />}
          {view === "watchlist" && <Watchlist profiles={profile} />}
          {view === "order" && <OrderList />}
          {view === "orderAuct" && <OrderAuct />}
        </section>
      </div>
    </>
  );
};

export default ProfileUse;
