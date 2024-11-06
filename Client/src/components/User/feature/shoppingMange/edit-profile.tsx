// import React, { useState, useEffect } from "react";
// import { UserProfile } from "../../../../types/user";
// import { useAppDispatch } from "../../../../redux/store";
// import { setProfile } from "../../../../redux/auth/authSlice";
// import {
//   updateProfileThunk,
//   getProfileThunk,
// } from "../../../../redux/auth/authThunk";
// import axios from "axios";
// import moment from "moment";

// interface EditProfileProps {
//   profile: UserProfile | null;
// }

// const EditProfile: React.FC<EditProfileProps> = ({ profile }) => {
//   const [localProfile, setLocalProfile] = useState<UserProfile | null>(profile);
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);

//   const dispatch = useAppDispatch();
//   // const profileState = useAppSelector((state) => state.auth.profile);

//   useEffect(() => {
//     if (profile) {
//       setLocalProfile(profile);
//       if (profile.avatar) {
//         setImagePreview(profile.avatar); // Assuming the avatar URL is directly available
//       }
//     }
//   }, [profile]);

//   const birthday = localProfile?.birthday
//     ? moment(localProfile.birthday).format("YYYY-MM-DD")
//     : "";

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, files } = e.target as HTMLInputElement;

//     console.log(`Name: ${name}, Value: ${value}`); // Debugging line

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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!localProfile) return;

//     setLoading(true);
//     setMessage(null);

//     try {
//       const formData = new FormData();
//       formData.append("name", localProfile.name || "");
//       formData.append("address", localProfile.address || "");
//       formData.append("gender", localProfile.gender || "");
//       formData.append("phone", localProfile.phone || "");
//       formData.append("birthday", localProfile.birthday || "");
//       if (selectedImage) {
//         formData.append("avatar", selectedImage);
//       }

//       await dispatch(updateProfileThunk(formData)).unwrap();

//       const updatedProfile = await dispatch(getProfileThunk()).unwrap();
//       dispatch(setProfile(updatedProfile));

//       // localStorage.setItem("name", updatedProfile.name || "");
//       // localStorage.setItem("roles", updatedProfile.roles[0] || "");
//       // localStorage.setItem("birthday", updatedProfile.birthday || "");
//       // localStorage.setItem("avatar", updatedProfile.avatar || "");

//       setMessage("Profile updated successfully!");
//     } catch (err) {
//       console.error("Error updating profile:", err);

//       const errorMessage =
//         axios.isAxiosError(err) && err.response?.data?.msg
//           ? `Lỗi: ${err.response.status} - ${err.response.data.msg}`
//           : "Đã xảy ra lỗi không xác định";
//       setMessage(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="col-span-9 shadow-lg rounded-lg px-8 py-6 bg-white">
//       <h4 className="text-lg font-semibold text-gray-800 capitalize mb-6">
//         Cập Nhật Thông Tin
//       </h4>
//       <form onSubmit={handleSubmit}>
//         <div className="space-y-5">
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Tên
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 value={localProfile?.name || ""}
//                 onChange={handleChange}
//                 className="form-input mt-1 block w-full"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="address"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Địa chỉ
//               </label>
//               <input
//                 type="text"
//                 name="address"
//                 id="address"
//                 value={localProfile?.address || ""}
//                 onChange={handleChange}
//                 className="form-input mt-1 block w-full"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="phone"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Số điện thoại
//               </label>
//               <input
//                 type="text"
//                 name="phone"
//                 id="phone"
//                 value={localProfile?.phone || ""}
//                 onChange={handleChange}
//                 className="form-input mt-1 block w-full"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="birthday"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Ngày sinh
//               </label>
//               <input
//                 type="date"
//                 name="birthday"
//                 id="birthday"
//                 value={birthday}
//                 onChange={handleChange}
//                 className="form-input mt-1 block w-full"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="gender"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Giới tính
//               </label>
//               <select
//                 name="gender"
//                 id="gender"
//                 value={localProfile?.gender || ""}
//                 onChange={handleChange}
//                 className="form-select mt-1 block w-full"
//               >
//                 <option value="">Chọn giới tính</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 htmlFor="avatar"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Avatar
//               </label>
//               <input
//                 type="file"
//                 id="avatar"
//                 name="avatar"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="form-input mt-1 block w-full"
//               />
//               {imagePreview && (
//                 <img
//                   src={imagePreview}
//                   alt="Image Preview"
//                   className="mt-3 rounded-full"
//                   style={{
//                     width: "100px",
//                     height: "100px",
//                     objectFit: "cover",
//                   }}
//                 />
//               )}
//             </div>
//           </div>
//           <button
//             type="submit"
//             className={`w-full py-3 px-4 text-center text-white font-semibold rounded-md transition duration-150 ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Đang cập nhật..." : "Cập Nhật"}
//           </button>
//         </div>
//       </form>
//       {message && (
//         <p
//           className={`mt-4 text-sm font-medium ${
//             message.includes("thành công") ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default EditProfile;
import React, { useEffect, useState } from "react";
import { UserProfile } from "../../../../types/user";
import { useAppDispatch } from "../../../../redux/store";
import { setProfile } from "../../../../redux/auth/authSlice";
import {
  updateProfileThunk,
  getProfileThunk,
} from "../../../../redux/auth/authThunk";

import moment from "moment";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface EditProfileProps {
  profile: UserProfile | null;
}

const EditProfile: React.FC<EditProfileProps> = ({ profile }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>();

  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name || "");
      setValue("phone", profile.phone || "");
      setValue(
        "birthday",
        profile.birthday ? moment(profile.birthday).format("YYYY-MM-DD") : ""
      );
      setValue("gender", profile.gender || "");
      if (profile.avatar) {
        setImagePreview(profile.avatar);
      }
    }
  }, [profile, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
  };

  const onSubmit = async (data: UserProfile) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      // formData.append("address", data.address || "");
      formData.append("gender", data.gender || "");
      formData.append("phone", data.phone || "");
      formData.append("birthday", data.birthday || "");
      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const response = await dispatch(updateProfileThunk(formData)).unwrap();

      const updatedProfile = await dispatch(getProfileThunk()).unwrap();
      const successMessage = response?.message || "Cập nhật thành công!";
      toast.dismiss();
      toast.success(successMessage);
      dispatch(setProfile(updatedProfile));
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        (error as Error).message || "Registration failed. Please try again.";
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-9 shadow-lg rounded-lg px-8 py-6 bg-white">
      <h4 className="text-lg font-semibold text-gray-800 capitalize mb-6">
        Cập Nhật Thông Tin
      </h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Họ tên
              </label>
              <input
                type="text"
                {...register("name", { required: "Họ tên là bắt buộc" })}
                className={`form-input mt-1 block w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                {...register("phone", {
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: /^(0[0-9]{8,9})$/,
                    message: "Số điện thoại phải gồm 9-10 số",
                  },
                })}
                className={`form-input mt-1 block w-full border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ngày sinh
              </label>
              <input
                type="date"
                {...register("birthday", {
                  required: "Ngày sinh không được để trống",
                })}
                className={`form-input mt-1 block w-full border ${
                  errors.birthday ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.birthday && (
                <p className="text-red-500 text-sm">
                  {errors.birthday.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Giới tính
              </label>
              <select
                {...register("gender", {
                  required: "Giới tính không được để trống",
                })}
                className={`form-select mt-1 block w-full border ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ảnh đại diện
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleImageChange}
                className={`form-input mt-1 block w-full border ${
                  !selectedImage && errors.avatar
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.avatar && (
                <p className="text-red-500 text-sm">{errors.avatar.message}</p>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mt-3 rounded-full"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 text-center text-white font-semibold rounded-md transition duration-150 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập Nhật"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditProfile;
