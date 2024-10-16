import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { updatePasswordThunk } from "../../../../redux/auth/authThunk";
import { UserProfile } from "../../../../types/user";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UpdatePasswordProps {
  profile: UserProfile | null;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({}) => {
  const { register, handleSubmit, getValues, formState } =
    useForm<FormValues>();
  const dispatch: AppDispatch = useDispatch();
  const passwordUpdate = useSelector(
    (state: RootState) => state.auth.passwordUpdate
  );
  const [message, setMessage] = useState<string | null>(null);
  const [, setLoading] = useState<boolean>(false);
  const handlePasswordUpdate = async (data: FormValues) => {
    const { currentPassword, newPassword } = data;

    setLoading(true); // Bắt đầu trạng thái tải

    try {
      const resultAction = await dispatch(
        updatePasswordThunk({ currentPassword, newPassword })
      ).unwrap();

      if (resultAction && "status" in resultAction) {
        if (resultAction.status === 200) {
          setMessage(resultAction.message || "Cập nhật mật khẩu thành công.");
        } else {
          setMessage(
            resultAction.message || "Đã xảy ra lỗi khi cập nhật mật khẩu."
          );
        }
      }
    } catch (error: any) {
      if (error instanceof Error) {
        setMessage(error.message || "Đã xảy ra lỗi khi cập nhật mật khẩu.");
      } else {
        setMessage("Đã xảy ra lỗi khi cập nhật mật khẩu.");
      }
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  return (
    <div className="col-span-9 shadow-lg rounded-lg px-8 py-6 bg-white">
      <h4 className="text-lg font-semibold text-gray-800 capitalize mb-6">
        Cập Nhật Mật Khẩu
      </h4>
      <form onSubmit={handleSubmit(handlePasswordUpdate)} className="space-y-5">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            id="currentPassword"
            className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            {...register("currentPassword", {
              required: "Mật khẩu hiện tại là bắt buộc",
            })}
          />
          {formState.errors.currentPassword && (
            <p className="text-sm text-red-600 mt-2">
              {formState.errors.currentPassword.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            {...register("newPassword", {
              required: "Mật khẩu mới là bắt buộc",
              validate: (value) =>
                value !== getValues("currentPassword") ||
                "Mật khẩu mới không được trùng với mật khẩu hiện tại",
            })}
          />
          {formState.errors.newPassword && (
            <p className="text-sm text-red-600 mt-2">
              {formState.errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            {...register("confirmNewPassword", {
              required: "Xác nhận mật khẩu mới là bắt buộc",
              validate: (value) =>
                value === getValues("newPassword") || "Mật khẩu mới không khớp",
            })}
          />
          {formState.errors.confirmNewPassword && (
            <p className="text-sm text-red-600 mt-2">
              {formState.errors.confirmNewPassword.message}
            </p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className={`w-full py-3 px-4 text-center text-white font-semibold rounded-md transition duration-150 ${
              passwordUpdate.status === "loading"
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
            disabled={passwordUpdate.status === "loading"}
          >
            {passwordUpdate.status === "loading"
              ? "Đang cập nhật..."
              : "Cập nhật mật khẩu"}
          </button>
        </div>
        {message && (
          <div
            className={`mt-4 text-sm font-medium ${
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
