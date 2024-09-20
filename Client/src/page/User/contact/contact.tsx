import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../redux/store'; // Nếu có hook sử dụng dispatch
import { contactFormThunk } from '../../../redux/contact/contactThunk'; // Import action tương ứng

interface FormValues {
  id_user: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setResponseMessage(null);

  // const userId = /* Lấy id_user từ state hoặc props */;
  
  // const contactData = { ...data, id_user: userId };

    try {
      const resultAction = await dispatch(contactFormThunk(data));

      if (contactFormThunk.fulfilled.match(resultAction)) {
        setResponseMessage('Tin nhắn đã được gửi thành công!');
      } else {
        setResponseMessage('Đã xảy ra lỗi khi gửi tin nhắn.');
      }
    } catch (error) {
      setResponseMessage('Có lỗi xảy ra khi gửi tin nhắn.');
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
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Tên của bạn
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("name", { required: "Tên không được bỏ trống" })}
            />
            {formState.errors.name && (
              <small className="text-red-600">{formState.errors.name.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("phone", { required: "Số điện thoại không được bỏ trống" })}
            />
            {formState.errors.phone && (
              <small className="text-red-600">{formState.errors.phone.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("email", { required: "Email không được bỏ trống" })}
            />
            {formState.errors.email && (
              <small className="text-red-600">{formState.errors.email.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium">
              Tin nhắn
            </label>
            <textarea
              id="message"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              {...register("message", { required: "Tin nhắn không được bỏ trống" })}
            />
            {formState.errors.message && (
              <small className="text-red-600">{formState.errors.message.message}</small>
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
            <div className="mt-4 text-center text-green-600">{responseMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
