import React, { useEffect } from "react";
import { UserProfile } from "../../../../types/user";
import moment from "moment";

import { useAppDispatch } from "../../../../redux/store";
import { getProfileThunk } from "../../../../redux/auth/authThunk";

interface InfoProps {
  profiles: UserProfile | null;
}

const Info: React.FC<InfoProps> = ({ profiles }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  if (!profiles) return <p>No profile data available</p>;

  const formattedBirthday = profiles.birthday
    ? moment(profiles.birthday).format("DD/MM/YYYY")
    : "";

  const defaultAddress =
    profiles.addresses?.find((address) => address.isDefault) ?? null;
  return (
    <div className="col-span-9 shadow-lg rounded-lg px-6 pt-5 pb-7 bg-white">
      <h4 className="text-lg font-semibold text-gray-800 capitalize mb-4">
        Thông tin cá nhân
      </h4>
      <div className="space-y-6">
        {/* Sử dụng grid với responsive classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="first"
              className="block text-sm font-medium text-gray-700"
            >
              Họ tên
            </label>
            <input
              type="text"
              name="first"
              id="first"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={profiles.name || ""}
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="birthday"
              className="block text-sm font-medium text-gray-700"
            >
              Sinh nhật
            </label>
            <input
              type="text"
              name="birthday"
              id="birthday"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formattedBirthday}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Giới tính
            </label>
            <input
              name="gender"
              id="gender"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={profiles.gender || ""}
              readOnly
            />
            <div className="absolute top-0 right-0">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                data-tooltip-target="tooltip-gender"
              >
                ?
              </button>
              <div
                id="tooltip-gender"
                role="tooltip"
                className="absolute z-10 inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
              >
                Thông tin giới tính
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={profiles.email || ""}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={profiles.phone || ""}
              readOnly
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Địa chỉ
          </label>
          <textarea
            rows={4}
            name="address"
            id="address"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={defaultAddress?.address || "Không có địa chỉ mặc định"}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Info;
