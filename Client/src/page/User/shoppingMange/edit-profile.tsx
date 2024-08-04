import React, { useEffect, useState } from "react";
import { UserProfile } from "../../../types/user";
import { updateProfile } from "../../../services/authentication/auth.services";
import axios from "axios";

// interface UserProfile {
//   name: string;
//   email: string;
//   birthday: string;
//   gender: string;
//   phone: string;
// }
interface EditProfile {
  profile: UserProfile;
}
// interface EditProfileProps {
//   profile: UserProfile;
//   // onProfileUpdate: (profileData: UserProfile) => void;
// }
const EditProfile: React.FC<EditProfile> = ({ profile }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLocalProfile(profile); // Cập nhật khi props thay đổi
  }, [profile]);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Chuyển đổi thành định dạng yyyy-MM-dd
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await updateProfile(localProfile);
      console.log("Profile updated successfully:", response);

      const successMessage = response.msg;
      setMessage(successMessage);
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
    <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
      <h4 className="text-lg font-medium capitalize mb-4">Cập Nhật Thông Tin</h4>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name">Tên</label>
              <input
                type="text"
                name="name"
                id="name"
                value={localProfile.name}
                onChange={handleChange}
                className="input-box"
              />
            </div>
            <div>
              <label htmlFor="birthday">Ngày sinh</label>
              <input
                type="date"
                name="birthday"
                id="birthday"
                value={formatDateForInput(localProfile.birthday || "")}
                onChange={handleChange}
                className="input-box"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender">Giới tính</label>
              <select
                name="gender"
                id="gender"
                value={localProfile.gender}
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
export default EditProfile;
