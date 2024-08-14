import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  fetchUserById,
  updateUserThunk,
  // getlistRoleThunk,
} from "../../../../redux/auth/authThunk";
import "../../../../assets/css/admin.style.css";
import { AppDispatch } from "../../../../redux/store";
import moment from "moment";
import { UserProfile } from "../../../../types/user";
import axios from "axios";

const AdminEditUser = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Lấy userId từ URL
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          const profile = await dispatch(fetchUserById(userId)).unwrap();
          setLocalProfile(profile);
          if (profile.avatar) {
            setImagePreview(profile.avatar);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setMessage("Không thể tải thông tin người dùng");
      }
    };

    fetchProfile();
  }, [userId, dispatch]);

  const birthday = localProfile?.birthday
    ? moment(localProfile.birthday).format("YYYY-MM-DD")
    : "";
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "avatar" && files) {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
        setSelectedImage(file);
      }
    } else {
      if (localProfile) {
        setLocalProfile({
          ...localProfile,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localProfile || !userId) return;

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", localProfile.name || "");
      formData.append("address", localProfile.address || "");
      formData.append("gender", localProfile.gender || "");
      formData.append("phone", localProfile.phone || "");
      formData.append("birthday", localProfile.birthday || "");

      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const updatedProfile = await dispatch(
        updateUserThunk({ userId, formData })
      ).unwrap();
      setLocalProfile(updatedProfile);

      setMessage("Cập nhật hồ sơ thành công!");
      navigate("/admin");
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? `Lỗi: ${err.response.status} - ${err.response.data.message}`
          : "Đã xảy ra lỗi không xác định";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
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
              {message && (
                <p
                  className={`text-xs italic ${
                    message.startsWith("Lỗi")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {message}
                </p>
              )}
              {loading && (
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
                    name="name"
                    value={localProfile?.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* 
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Roles
                  </label>
                  <input
                    id="roles"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    name="roles"
                    value={localProfile.roles?.join(", ") || ""}
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        roles: e.target.value
                          .split(", ")
                          .map((role) => role.trim()),
                      })
                    }
                    required
                  />
                </div>
              </div> */}

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    name="phone"
                    value={localProfile?.phone || ""}
                    onChange={handleChange}
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
                    name="address"
                    value={localProfile?.address || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  {/* <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Ngày sinh
                  </label>
                  <input
                    id="birthdate"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="date"
                    name="birthdate"
                    value={birthday}
                    onChange={handleChange}
                  /> */}

                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Ngày sinh
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="date"
                    name="birthday"
                    id="birthday"
                    value={birthday}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Avatar
                  </label>
                  <input
                    id="avatar"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Avatar preview"
                      className="w-24 h-24 object-cover mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  id="updateButton"
                  type="submit"
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                  disabled={loading}
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
export default AdminEditUser;
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   fetchUserById,
//   updateUserThunk,
//   getlistRoleThunk,
// } from "../../../../redux/auth/authThunk";
// import "../../../../assets/css/admin.style.css";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import moment from "moment";
// import { UserProfile } from "../../../../types/user";
// import axios from "axios";

// const AdminEditUser = () => {
//   const location = useLocation();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

//   // Lấy userId từ URL
//   const queryParams = new URLSearchParams(location.search);
//   const userId = queryParams.get("userId");

//   // Lấy danh sách roles từ Redux store
//   const roles = useSelector((state: RootState) => state.auth.profile.roles);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         if (userId) {
//           const profile = await dispatch(fetchUserById(userId)).unwrap();
//           setLocalProfile(profile);
//           setSelectedRoles(profile.roles || []);
//           if (profile.avatar) {
//             setImagePreview(profile.avatar);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setMessage("Không thể tải thông tin người dùng");
//       }
//     };

//     const fetchRoles = async () => {
//       try {
//         await dispatch(getlistRoleThunk()).unwrap();
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//         setMessage("Không thể tải danh sách quyền");
//       }
//     };

//     fetchProfile();
//     fetchRoles();
//   }, [userId, dispatch]);

//   const birthday = localProfile?.birthday
//     ? moment(localProfile.birthday).format("YYYY-MM-DD")
//     : "";

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, files } = e.target as HTMLInputElement;
//     const selectElement = e.target as HTMLSelectElement;

//     if (name === "avatar" && files) {
//       const file = files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           if (typeof reader.result === "string") {
//             setImagePreview(reader.result);
//           }
//         };
//         reader.readAsDataURL(file);
//         setSelectedImage(file);
//       }
//     } else if (name === "roles" && selectElement.selectedOptions) {
//       const selectedOptionsArray = Array.from(
//         selectElement.selectedOptions,
//         (option) => option.value
//       );
//       setSelectedRoles(selectedOptionsArray);
//     } else {
//       if (localProfile) {
//         setLocalProfile({
//           ...localProfile,
//           [name]: value,
//         });
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!localProfile || !userId) return;

//     setLoading(true);
//     setMessage(null);

//     try {
//       const formData = new FormData();
//       formData.append("name", localProfile.name || "");
//       formData.append("address", localProfile.address || "");
//       formData.append("gender", localProfile.gender || "");
//       formData.append("phone", localProfile.phone || "");
//       formData.append("birthday", localProfile.birthday || "");
//       formData.append("roles", selectedRoles.join(","));
//       if (selectedImage) {
//         formData.append("avatar", selectedImage);
//       }

//       const updatedProfile = await dispatch(
//         updateUserThunk({ userId, formData })
//       ).unwrap();
//       setLocalProfile(updatedProfile);

//       setMessage("Cập nhật hồ sơ thành công!");
//       navigate("/admin");
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       const errorMessage =
//         axios.isAxiosError(err) && err.response?.data?.message
//           ? `Lỗi: ${err.response.status} - ${err.response.data.message}`
//           : "Đã xảy ra lỗi không xác định";
//       setMessage(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="w-full flex-grow p-6">
//       <div className="flex flex-wrap">
//         <div className="w-full mt-6 pl-0 lg:pl-2">
//           <div className="leading-loose">
//             <form
//               onSubmit={handleSubmit}
//               className="p-10 bg-white rounded shadow-xl"
//             >
//               {message && (
//                 <p
//                   className={`text-xs italic ${
//                     message.startsWith("Lỗi")
//                       ? "text-red-500"
//                       : "text-green-500"
//                   }`}
//                 >
//                   {message}
//                 </p>
//               )}
//               {loading && (
//                 <p className="text-gray-500 text-xs italic">Đang cập nhật...</p>
//               )}
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Tên
//                   </label>
//                   <input
//                     id="name"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="text"
//                     name="name"
//                     value={localProfile?.name || ""}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Roles
//                   </label>
//                   <select
//                     id="roles"
//                     name="roles"
//                     multiple
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     value={selectedRoles}
//                     onChange={handleChange}
//                     required
//                   >
//                     {roles?.map((role) => (
//                       <option key={role} value={role}>
//                         {role}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Số điện thoại
//                   </label>
//                   <input
//                     id="phone"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="text"
//                     name="phone"
//                     value={localProfile?.phone || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Địa chỉ
//                   </label>
//                   <input
//                     id="address"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="text"
//                     name="address"
//                     value={localProfile?.address || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Ngày sinh
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="date"
//                     name="birthday"
//                     value={birthday}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Giới tính
//                   </label>
//                   <select
//                     id="gender"
//                     name="gender"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     value={localProfile?.gender || ""}
//                     onChange={handleChange}
//                   >
//                     <option value="">Chọn giới tính</option>
//                     <option value="male">Nam</option>
//                     <option value="female">Nữ</option>
//                     <option value="other">Khác</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Avatar
//                   </label>
//                   <input
//                     type="file"
//                     name="avatar"
//                     accept="image/*"
//                     onChange={handleChange}
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                   />
//                   {imagePreview && (
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="w-20 h-20 object-cover mt-2"
//                     />
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white py-2 px-4 rounded"
//                 >
//                   Cập nhật
//                 </button>
//                 <Link
//                   to="/admin"
//                   className="text-blue-500 hover:text-blue-700 text-xs font-bold"
//                 >
//                   Quay lại
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default AdminEditUser;
