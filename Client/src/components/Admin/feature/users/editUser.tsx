
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   fetchUserById,
//   updateUserThunk,
//   //   getlistRoleThunk,
// } from "../../../../redux/auth/authThunk";
// import { AppDispatch } from "../../../../redux/store";
// import moment from "moment";
// import { UserProfile } from "../../../../types/user";

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
//   const [message] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);

//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const userId = queryParams.get("userId");

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

//           setValue("name", profile.name);
//           //   setValue("address", profile.address);
//           setValue("gender", profile.gender);
//           setValue("phone", profile.phone);
//           setValue("birthday", moment(profile.birthday).format("YYYY-MM-DD"));
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
//           [name]: value,
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
//       //   formData.append("address", data.address || "");
//       formData.append("gender", data.gender || "");
//       formData.append("phone", data.phone || "");
//       formData.append("birthday", data.birthday || "");

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

//       setTimeout(() => {
//         navigate("/admin/listUser");
//       }, 3000);
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
//       {message && (
//         <p
//           className={`text-xs italic ${
//             message.startsWith("Lỗi") ? "text-red-500" : "text-green-500"
//           }`}
//         >
//           {message}
//         </p>
//       )}
//       {loading && (
//         <p className="text-gray-500 text-xs italic">Đang cập nhật...</p>
//       )}
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
//             {/* <div className="mb-4">
//               <label
//                 htmlFor="address"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Địa chỉ
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 {...register("address", { required: "Địa chỉ là bắt buộc" })}
//                 onChange={handleChange}
//                 className={`bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
//                   errors.address ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.address && (
//                 <p className="text-red-500 text-sm">{errors.address.message}</p>
//               )}
//             </div> */}
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
//             <button
//               type="submit"
//               className="relative text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//             >
//               {/* Hiển thị thông báo message */}
//               {message && (
//                 <p
//                   className={`absolute top-[-20px] left-0 w-full text-xs italic ${
//                     message.startsWith("Lỗi")
//                       ? "text-red-500"
//                       : "text-green-500"
//                   }`}
//                 >
//                   {message}
//                 </p>
//               )}

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
//       <ToastContainer />
//     </form>
//   );
// };

// export default AdminEditUser;
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchUserById,
  updateUserThunk,
} from "../../../../redux/auth/authThunk";
import { AppDispatch } from "../../../../redux/store";
import { UserProfile } from "../../../../types/user";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../../ultils/breadcrumb/admin";
import { Button, Image, Spinner } from "@nextui-org/react";

const AdminEditUser = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ password: string }>();

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
        toast.error("Không thể lấy thông tin người dùng");
      }
    };

    fetchProfile();
  }, [userId, dispatch]);

  // Function to generate random password
  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    const newPassword = Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
    setPassword(newPassword);
    setValue("password", newPassword);
    toast.dismiss();
    toast.info("Mật khẩu mới đã được tạo!");
  };
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        toast.dismiss();
        toast.success("Mật khẩu đã được sao chép!");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Không thể sao chép mật khẩu!");
      });
  };
  const onSubmit = async (data: { password: string }) => {
    if (!localProfile || !userId || !data.password) {
      toast.error("Vui lòng nhập mật khẩu hợp lệ!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("password", data.password);

      const response = dispatch(updateUserThunk({ userId, formData })).unwrap();

      toast.dismiss();
      const successMessage = (await response).message;
      toast.success(successMessage);

      setTimeout(() => {
        navigate("/admin/listUser");
      }, 3000);
    } catch (error) {
      const errorMessage = (error as string) || "Không thể cập nhật mật khẩu";
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Avatar preview"
                  className="w-24 h-24 object-cover mt-2"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 flex items-center justify-center mt-2 rounded-full">
                  <span className="text-white">No Avatar</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="password"
                  readOnly
                  value={password}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring bg-gray-100"
                  {...register("password")}
                />
                <i
                  onClick={copyToClipboard}
                  className="iconify solar--copy-bold w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded "
                ></i>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={generateRandomPassword}
            >
              Mật khẩu ngẫu nhiên
            </Button>
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
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="text"
                id="name"
                value={localProfile?.name || "trống"}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Số điện thoại
              </label>
              <input
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="text"
                id="name"
                value={localProfile?.phone || "trống"}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="birthday"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Ngày sinh
              </label>
              <input
                className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="text"
                id="name"
                value={localProfile?.birthday || "Trống"}
                readOnly
              />
            </div>
            <Button
              type="submit"
              className={`min-w-[200px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="warning" className="mr-2" />
                  <span className="whitespace-nowrap">Đang cập nhật...</span>
                </>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </form>
  );
};

export default AdminEditUser;
