import React, { useEffect, useState } from "react";
import { UserProfile } from "../../../types/user";
import { getProfile } from "../../../services/authentication/auth.services";
import moment from "moment";
// interface UserProfile {
//   name: string;
//   email: string;
//   birthday: string;
//   gender: string;
//   phone: string;
// }
interface info {
  profiles: UserProfile;
}

const info: React.FC<info> = ({ profiles }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserInfo();
  }, [profile]);

  const getUserInfo = async () => {
    try {
      const res = await getProfile();
      setProfile(res);
    } catch (err) {
      console.log("err === ", err);
    }
  };
  const formattedBirthday = profiles.birthday
    ? moment(profiles.birthday).format("DD/MM/YYYY") // Định dạng ngày theo ý muốn
    : "";
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
      <h4 className="text-lg font-medium capitalize mb-4">Thông tin cá nhân</h4>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first">Họ tên</label>
            <input
              type="text"
              name="first"
              id="first"
              className="input-box"
              value={profile.name || ""}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="birthday">Sinh nhật</label>
            <input
              type="text"
              name="birthday"
              id="birthday"
              className="input-box"
              // value={profile.birthday || ""}
              value={formattedBirthday}
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender">Giới tính</label>
            <input
              name="gender"
              id="gender"
              className="input-box"
              value={profile.gender || ""}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-box"
              value={profile.email || ""}
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="input-box"
              value={profile.phone || ""}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              name="address"
              id="address"
              className="input-box"
              value={profile.address || ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default info;
