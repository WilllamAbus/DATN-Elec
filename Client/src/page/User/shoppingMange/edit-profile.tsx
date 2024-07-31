import React from "react";
import UserProfile from "./profile";

interface editProfile {
  profiles: UserProfile;
}

const editProfile: React.FC<editProfile> = ({ profiles }) => (
  <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
    <h4 className="text-lg font-medium capitalize mb-4">Cập Nhật Thông Tin</h4>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first">Tên đệm</label>
          <input type="text" name="first" id="first" className="input-box" />
        </div>
        <div>
          <label htmlFor="last">Tên </label>
          <input type="text" name="last" id="last" className="input-box" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="birthday">Sinh nhật</label>
          <input
            type="date"
            name="birthday"
            id="birthday"
            className="input-box"
          />
        </div>
        <div>
          <label htmlFor="gender">Giới tính</label>
          <select name="gender" id="gender" className="input-box">
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" className="input-box" />
        </div>
        <div>
          <label htmlFor="phone">SĐT</label>
          <input type="text" name="phone" id="phone" className="input-box" />
        </div>
      </div>
    </div>
  </div>
);

export default editProfile;
