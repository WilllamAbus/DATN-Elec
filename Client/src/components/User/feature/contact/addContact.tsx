import { useForm } from "react-hook-form";
import { addContacts } from "../../../../services/contact/contact.service"; // Import action tương ứng
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../../../../ultils/success";
import {
  RootState,
  useAppSelector,
} from "../../../../redux/store";

interface IFormInput {
  id_user: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

const AddContact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );
  const navigate = useNavigate();
  const onSubmit = async (data: IFormInput) => {
    try {
      setLoading(true);
      console.log("Submitting data:", data);
      const payload = {
        id_user: data.id_user,
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message
      };

      await addContacts(payload); // Replace with your addContacts API call
      notify();
      setResponseMessage("Tin nhắn đã được gửi thành công!");
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Liên Hệ Với Chúng Tôi
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ToastContainer />
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Tên của bạn
            </label>
            <input id="id_user" type="hidden" value={profile?._id} {...register("id_user")} />
            <input value={profile?.name}
              type="text"
              id="name"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("name", { required: "Tên không được bỏ trống" })}
            />
            {errors.name && (
              <small className="text-red-600">{errors.name.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium">
              Số điện thoại
            </label>
            <input value={profile?.phone}
              type="text"
              id="phone"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("phone", {
                required: "Số điện thoại không được bỏ trống",
              })}
            />
            {errors.phone && (
              <small className="text-red-600">{errors.phone.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input value={profile?.email}
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("email", { required: "Email không được bỏ trống" })}
            />
            {errors.email && (
              <small className="text-red-600">{errors.email.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium">
              Tin nhắn
            </label>
            <textarea
              id="message"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("message", {
                required: "Tin nhắn không được bỏ trống",
              })}
            />
            {errors.message && (
              <small className="text-red-600">{errors.message.message}</small>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi tin nhắn"}
          </button>
          {responseMessage && (
            <div className="mt-4 text-center text-green-600">
              {responseMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddContact;
