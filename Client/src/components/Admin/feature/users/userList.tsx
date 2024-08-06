import React, { useEffect, useState } from "react";
import { getList } from "../../../../services/authentication/auth.services";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import "../../../../assets/css/admin.style.css";
import { AppDispatch, RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";

const userList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.auth.users);
  const userListStatus = useSelector(
    (state: RootState) => state.auth.profile.status
  );
  const userListError = useSelector(
    (state: RootState) => state.auth.profile.error
  );

  useEffect(() => {
    dispatch(getList() as any);
  }, [dispatch]);

  if (userListStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (userListStatus === "failed") {
    return <p>Error: {userListError}</p>;
  }

  // Kiểm tra nếu users là mảng và có dữ liệu
  if (!Array.isArray(users)) {
    return <p>Invalid data format</p>;
  }
  return (
    <main className="w-full flex-grow p-6">
      <div className="w-full mt-12">
        <p className="text-xl pb-3 flex items-center">
          <i className="fas fa-list mr-3"></i> DANH SÁCH SẢN PHẨM
        </p>
        <div className="bg-white overflow-auto">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  STT
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Họ Tên
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Email
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Ảnh
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Trạng thái
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-grey-lighter">
                    <td className="py-4 px-6 border-b border-grey-light">
                      {user._id}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {user.email}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <img
                        className="w-10 h-10 rounded-sm"
                        src={user.avatar}
                        alt="Student avatar"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(user.price)}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                        {user.status === "active" ? "Hiển thị" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      <button
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        // onClick={() => handlesoftDeleteProduct(product._id)}
                      >
                        Xoá
                      </button>
                      <Link
                        to={`/admin/editProducts/${user._id}`}
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <p>Không có người dùng nào.</p>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
          type="button"
        >
          <a href="/admin/addProducts">Thêm mới</a>
        </button>
        <button
          className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
          type="button"
        >
          <a href="/admin">Trở lại</a>
        </button>
      </div>
    </main>
  );
};
export default userList;
