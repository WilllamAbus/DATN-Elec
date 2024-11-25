import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchUserById,
  updateUserThunk,
  //   getlistRoleThunk,
} from "../../../../redux/auth/authThunk";
import { AppDispatch } from "../../../../redux/store";
import moment from "moment";
import { UserProfile } from "../../../../types/user";

import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../../ultils/breadcrumb";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminEditUser = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [message] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          const profile = await dispatch(fetchUserById(userId)).unwrap();
          setLocalProfile(profile);
          if (profile.avatar) {
            setImagePreview(profile.avatar);
          }

          setValue("name", profile.name);
          //   setValue("address", profile.address);
          setValue("gender", profile.gender);
          setValue("phone", profile.phone);
          setValue("birthday", moment(profile.birthday).format("YYYY-MM-DD"));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        const errorMessage =
          (error as Error).message || "Error fetching user profile";
        toast.dismiss();
        toast.error(errorMessage);
      }
    };

    fetchProfile();
  }, [userId, dispatch, setValue]);

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

  const onSubmit = async (data: UserProfile) => {
    if (!localProfile || !userId) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name || "");
      //   formData.append("address", data.address || "");
      formData.append("gender", data.gender || "");
      formData.append("phone", data.phone || "");
      formData.append("birthday", data.birthday || "");

      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const updatedProfile = await dispatch(
        updateUserThunk({ userId, formData })
      ).unwrap();
      setLocalProfile(updatedProfile);
      const successMessage =
        updatedProfile?.message || "Cập nhật hồ sơ thành công!";
      toast.success(successMessage);

      setTimeout(() => {
        navigate("/admin/listUser");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = (error as Error).message || "Error updating profile";
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      {message && (
        <p
          className={`text-xs italic ${
            message.startsWith("Lỗi") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
      {loading && (
        <p className="text-gray-500 text-xs italic">Đang cập nhật...</p>
      )}
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.editUser} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Cập nhật người dùng
        </h1>
      </div>
      <div className="grid grid-cols-[1fr_2fr] px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="w-24 h-24 object-cover mt-2"
                />
              )}
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                  Hình ảnh
                </h3>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800KB
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Giới tính
            </h3>
            <div className="mb-4">
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Chọn giới tính
              </label>
              <select
                id="gender"
                {...register("gender", { required: "Giới tính là bắt buộc" })} // Bắt buộc chọn giới tính
                className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                  errors.gender ? "border-red-500" : ""
                }`}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Thông tin người dùng
            </h3>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Họ và tên là bắt buộc" })}
                onChange={handleChange}
                className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone", {
                  required: "Số điện thoại là bắt buộc",
                })}
                onChange={handleChange}
                className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            {/* <div className="mb-4">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                {...register("address", { required: "Địa chỉ là bắt buộc" })}
                onChange={handleChange}
                className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div> */}
            <div className="mb-4">
              <label
                htmlFor="birthday"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Ngày sinh
              </label>
              <input
                type="date"
                id="birthday"
                {...register("birthday", { required: "Ngày sinh là bắt buộc" })}
                onChange={handleChange}
                className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                  errors.birthday ? "border-red-500" : ""
                }`}
              />
              {errors.birthday && (
                <p className="text-red-500 text-sm">
                  {errors.birthday.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="relative text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {/* Hiển thị thông báo message */}
              {message && (
                <p
                  className={`absolute top-[-20px] left-0 w-full text-xs italic ${
                    message.startsWith("Lỗi")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Hiển thị loading */}
              {loading ? (
                <span className="text-white ">Đang cập nhật...</span>
              ) : (
                "Cập nhật người dùng"
              )}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
};

export default AdminEditUser;
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   fetchUserById,
//   updateUserThunk,
// } from "../../../../redux/auth/authThunk";
// import { AppDispatch } from "../../../../redux/store";
// import moment from "moment";
// import { Role, UserProfile } from "../../../../types/user";

// import {
//   breadcrumbItems,
//   ReusableBreadcrumb,
// } from "../../../../ultils/breadcrumb";
// import { useForm } from "react-hook-form";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AdminEditUser = () => {
//   const location = useLocation();
//   const dispatch = useDispatch<AppDispatch>();
//   const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);

//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const userId = queryParams.get("userId");
//   const rolesData: Role[] = [
//     {
//       _id: "668e4b302713c5112934b0b7", // Cần có roleId
//       name: "Admin",
//       // permissions: ["read", "write", "delete"], // Cần có permissions
//     },
//     {
//       _id: "668e4b302713c5112934b0b8",
//       name: "User",
//       // permissions: ["read"], // Ví dụ quyền hạn cho User
//     },
//   ];

//   const [roles, setRoles] = useState<Role[]>(rolesData);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<UserProfile>();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         if (userId) {
//           const profile = await dispatch(fetchUserById(userId)).unwrap();
//           setLocalProfile(profile);
//           if (profile.avatar) {
//             setImagePreview(profile.avatar);
//           }

//           // Gán các giá trị khác
//           setValue("name", profile.name);

//           setValue("gender", profile.gender);
//           setValue("phone", profile.phone);
//           setValue("birthday", moment(profile.birthday).format("YYYY-MM-DD"));

//           // Gán vai trò nếu có

//           if (profile.roles && profile.roles.length > 0) {
//             setValue("roles", [profile.roles[0]._id]); // Gán mảng chứa ID của vai trò đầu tiên
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         const errorMessage =
//           (error as Error).message || "Error fetching user profile";
//         toast.dismiss();
//         toast.error(errorMessage);
//       }
//     };

//     fetchProfile();
//   }, [userId, dispatch, setValue]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, files } = e.target as HTMLInputElement;

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
//     } else {
//       if (localProfile) {
//         setLocalProfile({
//           ...localProfile,
//           roles: [value], // Chỉ cho phép chọn một vai trò
//         });
//       }
//     }
//   };

//   const onSubmit = async (data: UserProfile) => {
//     if (!localProfile || !userId) return;

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("name", data.name || "");
//       formData.append("gender", data.gender || "");
//       formData.append("phone", data.phone || "");
//       formData.append("birthday", data.birthday || "");

//       // Cập nhật role chính xác
//       // Cập nhật role chính xác
//       if (data.roles && data.roles.length > 0) {
//         const roleId = data.roles[0];
//         formData.append("roles", roleId); // Gửi ID vai trò đầu tiên
//       } else {
//         toast.error("Vui lòng chọn một vai trò hợp lệ!");
//         setLoading(false);
//         return;
//       }

//       if (selectedImage) {
//         formData.append("avatar", selectedImage);
//       }

//       const updatedProfile = await dispatch(
//         updateUserThunk({ userId, formData })
//       ).unwrap();

//       setLocalProfile(updatedProfile);

//       const successMessage =
//         updatedProfile?.message || "Cập nhật hồ sơ thành công!";
//       toast.success(successMessage);

//       navigate("/admin/listUser");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       const errorMessage = (error as Error).message || "Error updating profile";
//       toast.dismiss();
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
//       <ToastContainer />
//       <ReusableBreadcrumb items={breadcrumbItems.editUser} />
//       <div className="mb-4 ml-4 col-span-full xl:mb-2">
//         <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
//           Cập nhật người dùng
//         </h1>
//       </div>
//       <div className="grid grid-cols-[1fr_2fr] px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
//         <div className="col-span-full xl:col-auto">
//           <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
//             <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
//               {imagePreview && (
//                 <img
//                   src={imagePreview}
//                   alt="Avatar preview"
//                   className="w-24 h-24 object-cover mt-2"
//                 />
//               )}
//               <div>
//                 <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
//                   Hình ảnh
//                 </h3>
//                 <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
//                   JPG, GIF or PNG. Max size of 800KB
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <input
//                     type="file"
//                     name="avatar"
//                     accept="image/*"
//                     onChange={handleChange}
//                     className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
//             <h3 className="mb-4 text-xl font-semibold dark:text-white">
//               Giới tính
//             </h3>
//             <div className="mb-4">
//               <label
//                 htmlFor="gender"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Chọn giới tính
//               </label>
//               <select
//                 id="gender"
//                 {...register("gender", { required: "Giới tính là bắt buộc" })} // Bắt buộc chọn giới tính
//                 className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
//                   errors.gender ? "border-red-500" : ""
//                 }`}
//               >
//                 <option value="">Chọn giới tính</option>
//                 <option value="male">Nam</option>
//                 <option value="female">Nữ</option>
//               </select>
//               {errors.gender && (
//                 <p className="text-red-500 text-sm">{errors.gender.message}</p>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="col-span-full xl:col-auto">
//           <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
//             <h3 className="mb-4 text-xl font-semibold dark:text-white">
//               Thông tin người dùng
//             </h3>
//             <div className="mb-4">
//               <label
//                 htmlFor="name"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Họ và tên
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 {...register("name", { required: "Họ và tên là bắt buộc" })}
//                 onChange={handleChange}
//                 className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
//                   errors.name ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm">{errors.name.message}</p>
//               )}
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="phone"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Số điện thoại
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 {...register("phone", {
//                   required: "Số điện thoại là bắt buộc",
//                 })}
//                 onChange={handleChange}
//                 className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
//                   errors.phone ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-sm">{errors.phone.message}</p>
//               )}
//             </div>

//             <div className="mb-4">
//               <label
//                 htmlFor="birthday"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Ngày sinh
//               </label>
//               <input
//                 type="date"
//                 id="birthday"
//                 {...register("birthday", { required: "Ngày sinh là bắt buộc" })}
//                 onChange={handleChange}
//                 className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
//                   errors.birthday ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.birthday && (
//                 <p className="text-red-500 text-sm">
//                   {errors.birthday.message}
//                 </p>
//               )}
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="roles"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Chọn vai trò
//               </label>
//               <select
//                 {...register("roles", { required: true })}
//                 name="roles"
//                 value={localProfile?.roles?.[0] || ""}
//                 onChange={handleChange}
//                 className="form-select"
//               >
//                 {roles.map((role) => (
//                   <option key={role._id} value={role._id}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.roles && (
//                 <p className="text-red-500 text-sm">{errors.roles.message}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="relative text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//             >
//               {/* Hiển thị thông báo message */}
//               {/* {message && (
//                 <p
//                   className={`absolute top-[-20px] left-0 w-full text-xs italic ${
//                     message.startsWith("Lỗi")
//                       ? "text-red-500"
//                       : "text-green-500"
//                   }`}
//                 >
//                   {message}
//                 </p>
//               )} */}

//               {/* Hiển thị loading */}
//               {loading ? (
//                 <span className="text-white ">Đang cập nhật...</span>
//               ) : (
//                 "Cập nhật người dùng"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* <ToastContainer /> */}
//     </form>
//   );
// };

// export default AdminEditUser;
