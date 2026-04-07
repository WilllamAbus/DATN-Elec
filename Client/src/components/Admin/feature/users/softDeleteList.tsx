import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeletedListThunk,
  restoreUserThunk,
} from "../../../../redux/auth/authThunk";
import "../../../../assets/css/admin.style.css";
import { AppDispatch, RootState } from "../../../../redux/store";

import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AvatarFallback } from "../../../../ultils/avatar/avataAdmin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pagination } from "@nextui-org/react";
const MySwal = withReactContent(Swal);

const ListDelete: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  // const users = useSelector((state: RootState) => state.auth.deletedUsers);
  const users = useSelector((state: RootState) => state.auth.deleyedpagi || []);
  const [searchTerm, setSearchTerm] = useState<string>("");
  console.log(users);

  const currentPage = useSelector(
    (state: RootState) => state.auth.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.auth.pagination?.totalPages || 1
  );

  useEffect(() => {
    dispatch(
      getDeletedListThunk({
        page: currentPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const SearchTerm = event.target.value;
    setSearchTerm(SearchTerm);
    dispatch(
      getDeletedListThunk({
        page: 1,
        search: searchTerm,
      })
    );
  };
  const handlePageChange = (page: number) => {
    dispatch(
      getDeletedListThunk({
        page,
        search: searchTerm,
      })
    );
  };
  const handleRestore = async (userId: string) => {
    MySwal.fire({
      title: "Khôi phục người dùng?",
      text: "Bạn có chắc muốn khôi phục người dùng này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(restoreUserThunk(userId)).unwrap();

          toast.dismiss();
          const successMessage = response?.message;
          toast.success(successMessage);
        } catch (error) {
          console.error("Error deleting user:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi khôi phục người dùng.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <div className="w-full md:w-1/2">
          <form className="flex items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
              </div>
              <input
                value={searchTerm}
                onChange={handleSearchChange}
                type="text"
                id="simple-search"
                placeholder="Tìm kiếm đơn hàng..."
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
          </form>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
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
                    {user.name.length > 20
                      ? `${user.name.slice(0, 20)}...`
                      : user.name}
                  </div>
                </th>
                <td className="py-4 px-6 border-b border-grey-light">
                  {user.email}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  {user.roles.some((role) => role.name === "admin")
                    ? "Quản trị"
                    : "Người dùng"}
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
                      onClick={() => handleRestore(user._id)}
                    >
                      Khôi phục
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <p>Không có người dùng nào.</p>
          )}
        </tbody>
        <ToastContainer />
      </table>
      <div className="flex justify-center my-4">
        <Pagination
          isCompact
          loop
          showControls
          color="primary"
          total={totalPages}
          page={currentPage}
          initialPage={1}
          onChange={(page) => handlePageChange(page)}
        />
      </div>
    </>
  );
};

export default ListDelete;
