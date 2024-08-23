import React, { useState, useEffect } from "react";
import { UserProfile } from "../../../../types/user";
import { useAppDispatch } from "../../../../redux/store";
import { setProfile } from "../../../../redux/auth/authSlice";
import {
  updateProfileThunk,
  getProfileThunk,
} from "../../../../redux/auth/authThunk";
import axios from "axios";
import moment from "moment";

interface EditProfileProps {
  profile: UserProfile | null;
}

const EditProfile: React.FC<EditProfileProps> = ({ profile }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(profile);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  // const profileState = useAppSelector((state) => state.auth.profile);

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
      if (profile.avatar) {
        setImagePreview(profile.avatar); // Assuming the avatar URL is directly available
      }
    }
  }, [profile]);

  const birthday = localProfile?.birthday
    ? moment(localProfile.birthday).format("YYYY-MM-DD")
    : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    console.log(`Name: ${name}, Value: ${value}`); // Debugging line

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
    if (!localProfile) return;

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

      await dispatch(updateProfileThunk(formData)).unwrap();

      const updatedProfile = await dispatch(getProfileThunk()).unwrap();
      dispatch(setProfile(updatedProfile));

      // localStorage.setItem("name", updatedProfile.name || "");
      // localStorage.setItem("roles", updatedProfile.roles[0] || "");
      // localStorage.setItem("birthday", updatedProfile.birthday || "");
      // localStorage.setItem("avatar", updatedProfile.avatar || "");

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
    <div className="col-span-9 shadow-lg rounded-lg px-8 py-6 bg-white">
      <h4 className="text-lg font-semibold text-gray-800 capitalize mb-6">
        Cập Nhật Thông Tin
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={localProfile?.name || ""}
                onChange={handleChange}
                className="form-input mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={localProfile?.address || ""}
                onChange={handleChange}
                className="form-input mt-1 block w-full"
              />
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
                name="phone"
                id="phone"
                value={localProfile?.phone || ""}
                onChange={handleChange}
                className="form-input mt-1 block w-full"
              />
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
                name="birthday"
                id="birthday"
                value={birthday}
                onChange={handleChange}
                className="form-input mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Giới tính
              </label>
              <select
                name="gender"
                id="gender"
                value={localProfile?.gender || ""}
                onChange={handleChange}
                className="form-select mt-1 block w-full"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Avatar
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="form-input mt-1 block w-full"
              />
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
      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.includes("thành công") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default EditProfile;
