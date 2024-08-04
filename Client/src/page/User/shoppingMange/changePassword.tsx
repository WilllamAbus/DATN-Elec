import React, { useEffect, useState } from "react";
import { UserProfile } from "../../../types/user";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../redux/rootReducer";
import { updateUserProfile } from "../../../redux/auth/authThunk";
import { RootState } from "../../../redux/rootReducer";
import axios from "axios";

// interface UserProfile {
//   name: string;
//   email: string;
//   birthday: string;
//   gender: string;
//   phone: string;
// }
interface EditProfile {
  profile: UserProfile | null;
}
const defaultProfile: UserProfile = {
  msg: "",
  token: "",
  _id: "",
  name: "",
  accessToken: "",
  email: "",
  profile: "",
  VerifiedEmail: "",
  status: "",
  roles: "",
  birthday: "",
  gender: "",
  phone: "",
  address: "",
  createdAt: "",
  updatedAt: "",

  // Các thuộc tính khác với giá trị mặc định
};
// interface EditProfileProps {
//   profile: UserProfile;
//   // onProfileUpdate: (profileData: UserProfile) => void;
// }
const changePassword: React.FC<EditProfile> = ({ profile }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(
    profile || defaultProfile
  );
  const [view, setView] = useState<"info" | "edit">("info");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const profileStatus = useAppSelector(
    (state: RootState) => state.auth.profile.status
  );
  const profileError = useAppSelector(
    (state: RootState) => state.auth.profile.error
  );

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        ...defaultProfile,
        ...profile,
      });
    }
  }, [profile]);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (localProfile) {
      setLocalProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localProfile) return;

    setLoading(true);
    setMessage(null);

    try {
      const resultAction = await dispatch(
        updateUserProfile(localProfile)
      ).unwrap();
      console.log("Profile updated successfully:", resultAction);

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
      <h4 className="text-lg font-medium capitalize mb-4">
        Cập Nhật Thông Tin
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name">Mật khẩu cũ</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                className="input-box"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password">Mật khẩu mới</label>
              <select
                name="password"
                id="password"
                onChange={handleChange}
                className="input-box"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div>
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={localProfile.phone}
                onChange={handleChange}
                className="input-box"
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <div>
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                name="address"
                id="address"
                value={localProfile.address || ""}
                onChange={handleChange}
                className="input-box"
              />
            </div>
          </div>
          <button
            type="submit"
            className="py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </form>
    </div>
  );
};
export default changePassword;
