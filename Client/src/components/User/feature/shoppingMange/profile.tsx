// import React, { useEffect, useState } from "react";
// import {
//   RootState,
//   useAppDispatch,
//   useAppSelector,
// } from "../../../../redux/store";
// import { Link, useNavigate } from "react-router-dom";
// import { logoutThunk } from "../../../../redux/auth/authThunk";
// import EditProfile from "./edit-profile";
// import Info from "./info";
// import Watchlist from "./wathlist";
// import UpdatePassword from "./changePassword";
// import CountrySelector from "./address";
// import OrderList from "./order";
// import OrderAuct from "./orderAuctStatus";
// import useAuth from "../../../../hooks/useAuth";

// import Cookies from "js-cookie";
// import { fetchUserOrdersThunk } from "../../../../redux/order/orderThunks";
// // import SidebarDrawer from "../../../../ultils/dropdown/client/nav/Sidebar.prodile";
// const ProfileUse: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
//   const [view, setView] = useState<
//     | "order"
//     | "orderAuct"
//     | "info"
//     | "edit"
//     | "address"
//     | "password"
//     | "watchlist"
//     | "detail"
//   >("info");
//   const toggleDrawer = () => {
//     setIsOpen(!isOpen);
//   };

//   const profile = useAppSelector(
//     (state: RootState) => state.auth.profile.profile
//   );
//   const profileStatus = useAppSelector(
//     (state: RootState) => state.auth.profile.status
//   );
//   const profileError = useAppSelector(
//     (state: RootState) => state.auth.profile.error
//   );
//   const [, setAddress] = useState<string>("");
//   useEffect(() => {
//     dispatch(fetchUserOrdersThunk());
//   }, [dispatch]);
//   (newAddress: string) => {
//     setAddress(newAddress);
//   };
//   useAuth();

//   if (profileStatus === "failed") {
//     return <p>Error: {profileError || "Unknown error occurred"}</p>;
//   }
//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutThunk()).unwrap();

//       Cookies.remove("token");
//       Cookies.remove("refreshToken");

//       navigate("/login", { replace: true });
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <>
//       {/* Breadcrumb */}

//       <nav className=" py-4 flex items-center space-x-3 bg-gray-50 rounded-lg shadow-sm">
//         <Link to="/" className="text-primary text-lg">
//           <i className="fa-solid fa-house"></i>
//         </Link>
//         <span className="text-gray-400">
//           <i className="fa-solid fa-chevron-right"></i>
//         </span>
//         <h4 className="text-gray-600 py-2 font-medium">HỒ SƠ KHÁCH HÀNG</h4>
//       </nav>

//       {/* Wrapper */}
//       <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">
//         {/* <SidebarDrawer /> */}
//         <div className=" -z-14">
//           <button
//             onClick={toggleDrawer}
//             className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//           >
//             <span className="sr-only">Open sidebar</span>
//             <svg
//               className="w-6 h-6"
//               aria-hidden="true"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 clipRule="evenodd"
//                 fillRule="evenodd"
//                 d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//               ></path>
//             </svg>
//           </button>

//           {/* Sidebar */}

//           <aside
//             className={`fixed top-40 left-0 z-10 w-64 h-96 transition-transform transform ${
//               isOpen ? "translate-x-0" : "-translate-x-full"
//             } sm:translate-x-0`}
//             aria-label="Sidebar"
//           >
//             <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 h-screen overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <a href="/" className="flex items-center">
//                   <img
//                     src={profile?.avatar}
//                     className="h-6 me-3 sm:h-7"
//                     alt="Flowbite Logo"
//                   />
//                   <h4 className="text-gray-600">Xin chào,</h4>
//                   <h4 className="text-gray-800 font-semibold">
//                     {profile?.name}
//                   </h4>
//                 </a>

//                 {/* Close Button */}
//                 <button
//                   type="button"
//                   onClick={toggleDrawer}
//                   className="text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg p-2 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     ></path>
//                   </svg>
//                   <span className="sr-only">Close sidebar</span>
//                 </button>
//               </div>

//               <ul className="space-y-2 font-medium">
//                 <li>
//                   <a
//                     href="#"
//                     className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
//                       view === "info"
//                         ? "bg-gray-100  text-gray-900"
//                         : "text-gray-600"
//                     }`}
//                     onClick={() => setView("info")}
//                   >
//                     <span className="iconify mdi--account w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>

//                     <span className="ms-3"> Quản lý tài khoản</span>
//                   </a>

//                   <a
//                     href="#"
//                     className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
//                       view === "edit"
//                         ? "bg-gray-100  text-gray-900"
//                         : "text-gray-600"
//                     }`}
//                     onClick={() => setView("edit")}
//                   >
//                     <svg
//                       className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         fill-rule="evenodd"
//                         d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z"
//                         clip-rule="evenodd"
//                       />
//                     </svg>

//                     <span className="ms-3"> Cập nhật thông tin</span>
//                   </a>

//                   <a
//                     href="#"
//                     className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
//                       view === "password"
//                         ? "bg-gray-100  text-gray-900"
//                         : "text-gray-600"
//                     }`}
//                     onClick={() => setView("password")}
//                   >
//                     <span className="iconify mdi--password w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>
//                     <span className="ms-3"> Đổi mật khẩu</span>
//                   </a>

//                   <a
//                     href="#"
//                     className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
//                       view === "address"
//                         ? "bg-gray-100  text-gray-900"
//                         : "text-gray-600"
//                     }`}
//                     onClick={() => setView("address")}
//                   >
//                     <span className="iconify mdi--map-marker w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>
//                     <span className="ms-3"> Địa chỉ</span>
//                   </a>

//                   <a
//                     className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//                     onClick={toggleDropdown}
//                   >
//                     <span className="iconify mdi--cart w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>
//                     <span className="ms-3">Quản lý đơn hàng</span>
//                   </a>

//                   {isDropdownOpen && (
//                     <div className="absolute mt-2 w-full z-50 bg-white rounded-lg shadow-lg dark:bg-gray-800">
//                       <a
//                         href="#"
//                         className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
//                           view === "order"
//                             ? "bg-gray-100 text-gray-900"
//                             : "text-gray-600"
//                         }`}
//                         onClick={() => {
//                           setView("order");
//                           setDropdownOpen(false);
//                         }}
//                       >
//                         <span className="iconify mdi--cart-outline w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>
//                         <span className="ms-3"> Đơn hàng</span>
//                       </a>

//                       <a
//                         href="#"
//                         className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
//                           view === "orderAuct"
//                             ? "bg-gray-100 text-gray-900"
//                             : "text-gray-600"
//                         }`}
//                         onClick={() => {
//                           setView("orderAuct");
//                           setDropdownOpen(false);
//                         }}
//                       >
//                         <span className="iconify mdi--gavel w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>
//                         <span className="ms-3"> Đơn hàng đấu giá</span>
//                       </a>
//                     </div>
//                   )}

//                   <a
//                     href="#"
//                     className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
//                       view === "watchlist"
//                         ? "bg-gray-100  text-gray-900"
//                         : "text-gray-600"
//                     }`}
//                     onClick={() => setView("watchlist")}
//                   >
//                     <span className="iconify mdi--heart w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>
//                     <span className="ms-3">Yếu thích</span>
//                   </a>

//                   <a
//                     href="#"
//                     className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//                     onClick={handleLogout}
//                   >
//                     <span className="iconify mdi--logout w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></span>
//                     <span className="ms-3"> Đăng Xuất</span>
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </aside>
//         </div>
//         {/* Main Content Section */}

//         <section className="col-span-9 bg-white shadow-sm rounded-lg p-6">
//           {view === "info" && <Info profiles={profile} />}
//           {view === "edit" && <EditProfile profile={profile} />}
//           {view === "address" && (
//             <CountrySelector
//               address={profile?.address || ""}
//               onAddressChange={() => {}}
//               profile={profile}
//             />
//           )}
//           {view === "password" && <UpdatePassword profile={profile} />}
//           {view === "watchlist" && <Watchlist profiles={profile} />}
//           {view === "order" && <OrderList />}
//           {view === "orderAuct" && <OrderAuct />}
//         </section>
//       </div>
//     </>
//   );
// };

// export default ProfileUse;

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
// import CountrySelector from "./address/address";
import ListAddress from "./address/listAddress";
import OrderList from "./order";
import OrderAuct from "./orderAuctStatus";
import ListBid from "./listBidding";
import useAuth from "../../../../hooks/useAuth";
import Cookies from "js-cookie";
import { fetchUserOrdersThunk } from "../../../../redux/order/orderThunks";
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

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

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
            <span className="ms-3"> Lịch sử lệnh đấu giá</span>
          </>
        )}
      </button>
    </li>
  );

  return (
    <>
      {/* Breadcrumb */}
      <nav className="py-4  flex items-center space-x-3 bg-blue-50 rounded-lg shadow-sm">
        {/* <a className="text-blue-600 text-lg">
          <i className="fa-solid fa-house"></i>
        </a> */}

        {/* Nút button được thêm vào đây */}
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
      {/* Wrapper */}

      <div className="pb-0 pt-10 min-h-[calc(76vh-10rem)]">
        <div className="container  mx-auto grid grid-cols-12 gap-6 pt-4 pb-16">
          {/* Sidebar */}
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
