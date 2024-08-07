import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { updateUserThunk } from "../../../../redux/auth/authThunk";
import "../../../../assets/css/admin.style.css";
import { AppDispatch, RootState } from "../../../../redux/store";

const editUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams<{ userId: string }>();

  const { updateUserStatus, updateUserError } = useSelector(
    (state: RootState) => state.auth
  );

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");

  useEffect(() => {
    // Khi component mount, bạn có thể gọi một thunk khác để lấy thông tin người dùng nếu cần
    // Ví dụ: dispatch(getUserDetailsThunk(userId));
  }, [userId, dispatch]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) {
      console.error("User ID is required");
      return;
    }

    dispatch(
      updateUserThunk({
        userId,
        userData: { name, email, password, roles, phone, address, birthdate },
      })
    )
      .unwrap()
      .catch((error) => console.error("Failed to update user:", error));
  };

  return (
    <main className="w-full flex-grow p-6">
      <div className="flex flex-wrap">
        <div className="w-full mt-6 pl-0 lg:pl-2">
          <div className="leading-loose">
            <form
              onSubmit={handleSubmit}
              className="p-10 bg-white rounded shadow-xl"
            >
              {updateUserError && (
                <p className="text-red-500 text-xs italic">{updateUserError}</p>
              )}
              {updateUserStatus === "loading" && (
                <p className="text-gray-500 text-xs italic">Đang cập nhật...</p>
              )}
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Tên
                  </label>
                  <input
                    id="name"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Roles
                  </label>
                  <input
                    id="roles"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={roles.join(", ")}
                    onChange={(e) =>
                      setRoles(
                        e.target.value.split(", ").map((role) => role.trim())
                      )
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Địa chỉ
                  </label>
                  <input
                    id="address"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Ngày sinh
                  </label>
                  <input
                    id="birthdate"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  id="updateButton"
                  type="submit"
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                  disabled={updateUserStatus === "loading"}
                >
                  Cập nhật
                </button>
                <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded">
                  <Link to="/admin/listUsers">Trở lại</Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default editUser;
