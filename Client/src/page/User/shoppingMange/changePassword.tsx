import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { updatePasswordThunk } from "../../../redux/auth/authThunk";
import { UserProfile } from "../../../types/user";

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
              validate: (value) =>
                value !== getValues("currentPassword") ||
                "Mật khẩu mới không được trùng với mật khẩu hiện tại",
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
            className={`py-3 px-4 text-center text-white border border-primary rounded-md transition font-medium ${
              passwordUpdate.status === "loading"
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-transparent hover:text-primary"
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
