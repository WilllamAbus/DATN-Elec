

import React, { useEffect, useState } from "react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../../../redux/auth/authThunk";
import EditProfile from "./edit-profile";
import Info from "./info";
import Watchlist from "./wathlist";
import UpdatePassword from "./changePassword";
import Bank from "./bank/listBank";
import ListAddress from "./address/listAddress";
import OrderList from "./order";
import OrderAuct from "./orderAuctStatus";
import ListBid from "./listBidding";
import useAuth from "../../../../hooks/useAuth";
import Cookies from "js-cookie";
import { Transition } from "@headlessui/react";
import { User } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
const ProfileUse: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<
    | "order"
    | "orderAuct"
    | "info"
    | "edit"
    | "address"
    | "password"
    | "watchlist"
    | "listAddress"
    | "listBid"
    | "Bank"
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

  useEffect(() => {
    if (location.state) {
      const { view } = location.state as { view: string };

      if (view === "watchlist") {
        setView("watchlist");
      } else if (view === "address") {
        setView("address");
      } else if (view === "Bank") {
        setView("Bank");
      }
    }
  }, [location.state]);

  const MenuItem = ({
    item,
  }: {
    item:
      | "order"
      | "orderAuct"
      | "info"
      | "edit"
      | "address"
      | "password"
      | "watchlist"
      | "listBid"
      | "Bank";
  }) => (
    <li>
      <button
        className={`w-full text-left p-2 rounded-lg flex items-center ${
          view === item
            ? "bg-blue-200 text-blue-800"
            : "text-gray-600 hover:bg-blue-100"
        }`}
        onClick={() => {
          setView(item);
          isOpen && setIsOpen(false);
        }}
      >
        {item === "info" && (
          <>
            <i className="iconify mdi--account w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Quản lý tài khoản</span>
          </>
        )}
        {item === "edit" && (
          <>
            <i className="iconify mdi--edit w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Cập nhật thông tin</span>
          </>
        )}
        {item === "Bank" && (
          <>
            <i className="iconify mdi--bank w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Liên kết ngân hàng</span>
          </>
        )}
        {item === "address" && (
          <>
            <i className="iconify mdi--map-marker w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Địa chỉ</span>
          </>
        )}
        {item === "password" && (
          <>
            <i className="iconify mdi--password w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Đổi mật khẩu</span>
          </>
        )}
        {item === "watchlist" && (
          <>
            <i className="iconify mdi--heart w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3">Yêu thích</span>
          </>
        )}
        {item === "order" && (
          <>
            <i className="iconify mdi--cart-outline w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Đơn hàng</span>
          </>
        )}
        {item === "orderAuct" && (
          <>
            <i className="iconify mdi--gavel w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Đơn hàng đấu giá</span>
          </>
        )}
        {item === "listBid" && (
          <>
            <i className="iconify mdi--gavel w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
            <span className="ms-3"> Lịch sử đấu giá</span>
          </>
        )}
      </button>
    </li>
  );

  return (
    <>
      <nav className="py-4  flex items-center space-x-3 bg-blue-50 rounded-lg shadow-sm">

        <div className="flex pl-8 items-center">
          <span
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto lg:hidden p-3 text-white rounded-full"
          >
            <span className="iconify mdi--menu w-7 h-7 text-gray-500"></span>
          </span>

          <h4 className="text-gray-600 py-2 font-medium">HỒ SƠ KHÁCH HÀNG</h4>
        </div>
      </nav>

      <div className="pb-0 pt-10 min-h-[calc(76vh-10rem)]">
        <div className="container  mx-auto grid grid-cols-12 gap-6 pt-4 pb-16">

          <div className="hidden lg:block lg:col-span-3 ">
            <aside className="bg-white shadow-md rounded-lg p-4 h-full min-h-[calc(64vh-10rem)]">
              <User
                name={profile?.name || "Người dùng"}
                description="Xin Chào!"
                avatarProps={{
                  src:
                    profile?.avatar ||
                    "https://i.pravatar.cc/150?u=a04258114e29026702d",
                }}
              />

              <ul className="space-y-2">
                {[
                  "info",
                  "edit",
                  "address",
                  "password",
                  "watchlist",
                  "order",
                  "orderAuct",
                  "listBid",
                  "Bank",
                ].map((item) => (
                  <MenuItem
                    key={item}
                    item={
                      item as
                        | "order"
                        | "orderAuct"
                        | "listBid"
                        | "info"
                        | "edit"
                        | "address"
                        | "password"
                        | "watchlist"
                        | "Bank"
                    }
                  />
                ))}
                <li>
                  <button
                    className="w-full text-left p-2 text-gray-600 hover:bg-red-100 rounded-lg"
                    onClick={handleLogout}
                  >
                    <i className="iconify mdi--logout w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
                    <span className="ms-3"> Đăng Xuất</span>
                  </button>
                </li>
              </ul>
            </aside>
          </div>

          {/* Main Content Section */}
          <section className="col-span-12 lg:col-span-9 pl-8 bg-white shadow-sm rounded-lg ">
            {view === "info" && <Info profiles={profile} />}
            {view === "edit" && <EditProfile profile={profile} />}
            {/* {view === "address" && <listAddress  />} */}
            {view === "address" && <ListAddress />}
            {/* {view === "listAddress" && <listAddress />} */}
            {view === "password" && <UpdatePassword profile={profile} />}
            {view === "watchlist" && <Watchlist profiles={profile} />}
            {view === "order" && <OrderList />}
            {view === "orderAuct" && <OrderAuct />}
            {view === "listBid" && <ListBid />}
            {view === "Bank" && <Bank />}
          </section>
        </div>
      </div>
      {/* Mobile Sidebar */}
      {/* flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800
      dark:divide-gray-700 */}
      <div className="lg:hidden ">
        <Transition
          show={isOpen}
          enter="transition-all ease-out duration-300"
          enterFrom="opacity-0 -translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="transition-all ease-in duration-200"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 -translate-x-full"
        >
          <aside className=" fixed inset-y-20 left-0 bg-opacity-75 w-64 bg-white h-full p-5 shadow-lg ">
            <div className="absolute w-64 bg-white h-full pt-2">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-800 font-semibold">Menu</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500"
                >
                  <i className="iconify mdi--close w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                </button>
              </div>
              <ul className=" mt-4 space-y-2 ">
                {[
                  "info",
                  "edit",
                  "address",
                  "password",
                  "watchlist",
                  "order",
                  "orderAuct",
                  "Bank",
                ].map((item) => (
                  <MenuItem
                    key={item}
                    item={
                      item as
                        | "info"
                        | "edit"
                        | "address"
                        | "password"
                        | "watchlist"
                        | "order"
                        | "orderAuct"
                        | "listBid"
                        | "Bank"
                    }
                  />
                ))}
              </ul>

              <button
                className="  w-full text-left p-2 text-gray-600 hover:bg-red-100 rounded-lg mt-4"
                onClick={handleLogout}
              >
                <i className="iconify mdi--logout w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                <span className="ml-3">Đăng Xuất</span>
              </button>
            </div>
          </aside>
        </Transition>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProfileUse;
