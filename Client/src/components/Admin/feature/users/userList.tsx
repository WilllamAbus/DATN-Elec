import React, { useEffect } from "react";
import {
  getActiveListThunk,
  softDeleteUserThunk,
} from "../../../../redux/auth/authThunk";
import { Link } from "react-router-dom";
import "../../../../assets/css/admin.style.css";
import withReactContent from "sweetalert2-react-content";
import { AppDispatch, RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Swal, { SweetAlertResult } from "sweetalert2";
import { AvatarFallback } from "../../../../ultils/avatar/avataAdmin";

const MySwal = withReactContent(Swal);

const UserList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.auth.activeUsers);
  const userListStatus = useSelector(
    (state: RootState) => state.auth.activeUsersStatus
  );
  const userListError = useSelector(
    (state: RootState) => state.auth.activeUsersError
  );

  useEffect(() => {
    dispatch(getActiveListThunk());
  }, [dispatch]);

  const handlesoftDelete = async (userId: string) => {
    MySwal.fire({
      title: "Khóa người dùng?",
      text: "Bạn có chắc muốn khóa người dùng này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(softDeleteUserThunk(userId)).unwrap();

          // Không cần gọi lại getActiveListThunk nếu dữ liệu đã được cập nhật trong slice
          MySwal.fire({
            title: "Đã Khóa!",
            text: "Người dùng đã bị khóa.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi khóa người dùng.",
            icon: "error",
          });
        }
      }
    });
  };

  if (userListStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (userListStatus === "failed") {
    return <p>Error: {userListError}</p>;
  }

  if (!Array.isArray(users)) {
    return <p>Invalid data format</p>;
  }
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input
                id="checkbox-all"
                type="checkbox"
                className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="checkbox-all" className="sr-only">
                checkbox
              </label>
            </div>
          </th>
          <th scope="col" className="p-4">
            Stt
          </th>
          <th scope="col" className="p-4">
            Tên người dùng
          </th>
          <th scope="col" className="p-4">
            Email
          </th>
          <th scope="col" className="p-4">
            Vai trò
          </th>

          <th scope="col" className="p-4">
            Trạng thái
          </th>
          <th scope="col" className="p-4">
            Chức năng
          </th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user, index) => (
            <tr
              key={user._id}
              className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="p-4 w-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <td className="py-4 px-6 border-b border-grey-light">
                {index + 1}
              </td>
              <th
                scope="row"
                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="flex items-center mr-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="h-8 w-auto mr-3 rounded-sm"
                      alt="User Avatar"
                    />
                  ) : (
                    <AvatarFallback name={user.name} className="mr-3" />
                  )}
                  {user.name}
                </div>
              </th>
              <td className="py-4 px-6 border-b border-grey-light">
                {user.email}
              </td>
              <td className="py-4 px-6 border-b border-grey-light">
                {user.roles.includes("admin") ? "Quản trị" : "Người dùng"}
              </td>

              <td className="py-4 px-6 border-b border-grey-light">
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                  {user.status === "active" ? "Hiển thị" : "Đã ẩn"}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => handlesoftDelete(user._id)}
                  >
                    Khóa
                  </button>
                  <Link
                    to={`/admin/editUser?userId=${user._id}`}
                    className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sửa
                  </Link>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <p>Không có người dùng nào.</p>
        )}
      </tbody>
    </table>
  );
};

export default UserList;
