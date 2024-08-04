import React from "react";
import { UserProfile } from "../../../types/user";
import moment from "moment";
// interface UserProfile {
//   name: string;
//   email: string;
//   birthday: string;
//   gender: string;
//   phone: string;
// }
interface InfoProps {
  profiles: UserProfile;
}

const Info: React.FC<InfoProps> = ({ profiles }) => {
  if (!profiles) return <p>No profile data available</p>;

  const formattedBirthday = profiles.birthday
    ? moment(profiles.birthday).format("DD/MM/YYYY") // Định dạng ngày theo ý muốn
    : "";

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
              value={profiles.name || ""}
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
              value={profiles.gender || ""}
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
              value={profiles.email || ""}
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
              value={profiles.phone || ""}
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
              value={profiles.address || ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
