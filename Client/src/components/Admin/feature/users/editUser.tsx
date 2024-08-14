// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useParams } from "react-router-dom";
// import {
//   fetchUserById,
//   getProfileThunk,
//   updateUserThunk,
// } from "../../../../redux/auth/authThunk";
// import "../../../../assets/css/admin.style.css";
// import {
//   AppDispatch,
//   RootState,
//   useAppDispatch,
// } from "../../../../redux/store";
// import moment from "moment";
// import { UserProfile } from "../../../../types/user";
// import axios from "axios";

// const editUser = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const dispatch = useDispatch<AppDispatch>();
//   const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         if (userId) {
//           const profile = await dispatch(fetchUserById(userId)).unwrap();
//           setLocalProfile(profile);
//           if (profile.avatar) {
//             setImagePreview(profile.avatar);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       }
//     };

//     fetchProfile();
//   }, [userId, dispatch]);

//   const birthday = localProfile?.birthday
//     ? moment(localProfile.birthday).format("YYYY-MM-DD")
//     : "";

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
//       if (selectedImage) {
//         formData.append("avatar", selectedImage);
//       }

//       const updatedProfile = await dispatch(
//         updateUserThunk({ userId, formData })
//       ).unwrap();
//       setLocalProfile(updatedProfile);

//       localStorage.setItem("name", updatedProfile.name || "");
//       localStorage.setItem("roles", updatedProfile.roles[0] || "");
//       localStorage.setItem("birthday", updatedProfile.birthday || "");
//       localStorage.setItem("avatar", updatedProfile.avatar || "");

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

//   return (
//     <main className="w-full flex-grow p-6">
//       <div className="flex flex-wrap">
//         <div className="w-full mt-6 pl-0 lg:pl-2">
//           <div className="leading-loose">
//             <form
//               onSubmit={handleSubmit}
//               className="p-10 bg-white rounded shadow-xl"
//             >
//               {localProfile && (
//                 <p className="text-red-500 text-xs italic">{updateUserError}</p>
//               )}
//               {updateUserStatus === "loading" && (
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
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Email
//                   </label>
//                   <input
//                     id="email"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Mật khẩu
//                   </label>
//                   <input
//                     id="password"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Roles
//                   </label>
//                   <input
//                     id="roles"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="text"
//                     value={roles.join(", ")}
//                     onChange={(e) =>
//                       setRoles(
//                         e.target.value.split(", ").map((role) => role.trim())
//                       )
//                     }
//                     required
//                   />
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
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
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
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Ngày sinh
//                   </label>
//                   <input
//                     id="birthdate"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     type="date"
//                     value={birthdate}
//                     onChange={(e) => setBirthdate(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex gap-2">
//                 <button
//                   id="updateButton"
//                   type="submit"
//                   className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
//                   disabled={updateUserStatus === "loading"}
//                 >
//                   Cập nhật
//                 </button>
//                 <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded">
//                   <Link to="/admin/listUsers">Trở lại</Link>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default editUser;
import React, { useState, useEffect } from "react";
import { useDispatch,  } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchUserById,
  updateUserThunk,
} from "../../../../redux/auth/authThunk";
import "../../../../assets/css/admin.style.css";
import { AppDispatch, } from "../../../../redux/store";
// import moment from "moment";
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

  // Lấy query params từ URL
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
      }
    };

    fetchProfile();
  }, [userId, dispatch]);

  // const birthday = localProfile?.birthday
  //   ? moment(localProfile.birthday).format("YYYY-MM-DD")
  //   : "";

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

      localStorage.setItem("name", updatedProfile.name || "");
      localStorage.setItem("roles", updatedProfile.roles[0] || "");
      localStorage.setItem("birthday", updatedProfile.birthday || "");
      localStorage.setItem("avatar", updatedProfile.avatar || "");

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.msg
          ? `Lỗi: ${err.response.status} - ${err.response.data.msg}`
          : "Đã xảy ra lỗi không xác định";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-edit-user">
      <h1>Chỉnh sửa thông tin người dùng</h1>
      <form onSubmit={handleSubmit}>
        {/* Các trường input khác */}
        <input
          type="text"
          name="name"
          value={localProfile?.name || ""}
          onChange={handleChange}
        />
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />
        {imagePreview && <img src={imagePreview} alt="Preview" />}
        <button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default AdminEditUser;
