// src/components/UpdatePassword.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { updatePassword } from "../../../services/authentication/auth.services";
import { UserProfile } from "../../../types/user";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
interface password {
  profile: UserProfile | null;
}

const UpdatePassword: React.FC<password> = ({}) => {
  const { register, handleSubmit, getValues, formState } =
    useForm<FormValues>();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordUpdate = async (data: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      const { currentPassword, newPassword } = data;
      const response = await updatePassword(currentPassword, newPassword);
      setMessage(response.msg);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
      <h4 className="text-lg font-medium capitalize mb-4">Cập Nhật mật khẩu</h4>
      <form onSubmit={handleSubmit(handlePasswordUpdate)} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-gray-600 mb-2">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            id="currentPassword"
            className="border border-gray-300 px-4 py-2 w-full"
            {...register("currentPassword", {
              required: "Mật khẩu hiện tại là bắt buộc",
            })}
          />
          {formState.errors.currentPassword && (
            <small className="text-red-600">
              {formState.errors.currentPassword.message}
            </small>
          )}
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-gray-600 mb-2">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            className="border border-gray-300 px-4 py-2 w-full"
            {...register("newPassword", {
              required: "Mật khẩu mới là bắt buộc",
            })}
          />
          {formState.errors.newPassword && (
            <small className="text-red-600">
              {formState.errors.newPassword.message}
            </small>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-gray-600 mb-2"
          >
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="border border-gray-300 px-4 py-2 w-full"
            {...register("confirmNewPassword", {
              required: "Xác nhận mật khẩu mới là bắt buộc",
              validate: (value) =>
                value === getValues("newPassword") || "Mật khẩu mới không khớp",
            })}
          />
          {formState.errors.confirmNewPassword && (
            <small className="text-red-600">
              {formState.errors.confirmNewPassword.message}
            </small>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-blue py-2 px-4 rounded"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </div>
        {message && (
          <div
            className={`mt-4 ${
              message.includes("thành công") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdatePassword;
