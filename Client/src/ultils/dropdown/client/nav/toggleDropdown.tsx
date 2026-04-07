// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { RootState, useAppDispatch } from "../../../../redux/store";
// import { logoutThunk } from "../../../../redux/auth/authThunk";
// import { getProfileThunk } from "../../../../redux/auth/authThunk";
// import Cookies from "js-cookie";
// import { Transition } from "@headlessui/react";
// import { Avatar, Button } from "@nextui-org/react";

// const UserMenuDropdown: React.FC = () => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const profile = useSelector((state: RootState) => state.auth.profile.profile);
//   const isAuthenticated = useSelector(
//     (state: RootState) => state.auth.login.isAuthenticated
//   );

//   const isAdmin = profile?.roles?.includes("admin");
//   const isLoggedIn =
//     isAuthenticated && profile !== null && profile !== undefined;
//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(getProfileThunk());
//     }
//   }, [dispatch, isAuthenticated]);
//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutThunk()).unwrap();
//       Cookies.remove("token");
//       Cookies.remove("refreshToken");
//       navigate("/login");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };
//   return (
//     <div className="relative">
//       {isLoggedIn ? (
//         <>
//           <button
//             type="button"
//             className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 flex-shrink-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
//             id="userMenuDropdownButton"
//             aria-expanded={isOpen}
//             onClick={toggleDropdown}
//           >
//             <span className="sr-only">Open user menu</span>
//             <Avatar
//               className="w-8 h-8 rounded-full"
//               src={
//                 profile.avatar ||
//                 "https://cdn-icons-png.flaticon.com/128/149/149071.png"
//               }
//               alt="User photo"
//             />
//           </button>

//           <Transition
//             show={isOpen}
//             enter="transition ease-out duration-300"
//             enterFrom="opacity-0 translate-y-[-10%]"
//             enterTo="opacity-100 translate-y-0"
//             leave="transition ease-in duration-200"
//             leaveFrom="opacity-100 translate-y-0"
//             leaveTo="opacity-0 translate-y-[-10%]"
//           >
//             <div
//               className="absolute right-0 mt-2 z-50 w-56 text-base bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
//               id="userMenuDropdown"
//             >
//               <ul
//                 className="py-1 text-gray-500 dark:text-gray-400"
//                 aria-labelledby="userMenuDropdownButton"
//               >
//                 <li>
//                   <Link
//                     to="/profile"
//                     className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                   >
//                     <span className="font-bold">Hồ sơ cá nhân</span>
//                   </Link>
//                 </li>
//                 {isAdmin && (
//                   <li>
//                     <Link
//                       to="/admin"
//                       className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                     >
//                       <span className="font-bold">Trang Admin</span>
//                     </Link>
//                   </li>
//                 )}
//                 <li>
//                   <Button
//                     onClick={handleLogout}
//                     className="flex items-center w-full py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                   >
//                     <span className="font-bold">Đăng xuất</span>
//                   </Button>
//                 </li>
//               </ul>
//             </div>
//           </Transition>
//         </>
//       ) : (
//         <div>
//           <Link
//             to="/login"
//             className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white"
//           >
//             Đăng nhập
//           </Link>
//           <Link
//             to="/register"
//             className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white"
//           >
//             Đăng ký
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserMenuDropdown;
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { logoutThunk } from "../../../../redux/auth/authThunk";
import { getProfileThunk } from "../../../../redux/auth/authThunk";
import Cookies from "js-cookie";
import { Transition } from "@headlessui/react";
import { Avatar, Button } from "@nextui-org/react";

const UserMenuDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const profile = useSelector((state: RootState) => state.auth.profile.profile);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.login.isAuthenticated
  );

  const isAdmin = profile?.roles?.includes("admin");
  const isLoggedIn =
    isAuthenticated && profile !== null && profile !== undefined;
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfileThunk());
    }
  }, [dispatch, isAuthenticated]);
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
    <div className="relative">
      {isLoggedIn ? (
        <>
          <button
            type="button"
            className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 flex-shrink-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="userMenuDropdownButton"
            aria-expanded={isOpen}
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <Avatar
              className="w-8 h-8 rounded-full"
              src={
                profile.avatar ||
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
              alt="User photo"
            />
          </button>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-[-10%]"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-[-10%]"
          >
            <div
              className="absolute right-0 mt-2 z-50 w-56 text-base bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
              id="userMenuDropdown"
            >
              <ul
                className="py-1 text-gray-500 dark:text-gray-400"
                aria-labelledby="userMenuDropdownButton"
              >
                <Button>
                  <Link
                    to="/profile"
                    className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <i className="iconify mdi--account w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
                    <span className="font-bold">Hồ sơ cá nhân</span>
                  </Link>
                </Button>
                {isAdmin && (
                  <Button>
                    <Link
                      to="/admin"
                      className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <i className="iconify mdi--administrator w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
                      <span className="font-bold">Trang Admin</span>
                    </Link>
                  </Button>
                )}
                <li>
                  <Button
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <i className="iconify mdi--logout w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
                    <span className="font-bold">Đăng xuất</span>
                  </Button>
                </li>
              </ul>
            </div>
          </Transition>
        </>
      ) : (
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <Button size="sm" className="mb-2 sm:mb-0">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white"
            >
              Đăng nhập
            </Link>
          </Button>
          <Button size="sm">
            <Link
              to="/register"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white"
            >
              Đăng ký
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserMenuDropdown;
