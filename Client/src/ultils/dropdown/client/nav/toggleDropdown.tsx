import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { logoutThunk } from "../../../../redux/auth/authThunk";
import { getProfileThunk } from "../../../../redux/auth/authThunk"; // Nhập thunk lấy thông tin người dùng
import Cookies from "js-cookie";

const UserMenuDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Lấy thông tin người dùng và trạng thái xác thực từ Redux store
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
            <img
              className="w-8 h-8 rounded-full"
              src={
                profile.avatar ||
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
              alt="User photo"
            />
          </button>

          {isOpen && (
            <div
              className="absolute right-0 mt-2 z-50 w-56 text-base bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
              id="userMenuDropdown"
            >
              <ul
                className="py-1 text-gray-500 dark:text-gray-400"
                aria-labelledby="userMenuDropdownButton"
              >
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <span className="font-bold">Hồ sơ cá nhân</span>
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <span className="font-bold">Trang Admin</span>
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <span className="font-bold">Đăng xuất</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white"
          >
            Đăng ký
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserMenuDropdown;
