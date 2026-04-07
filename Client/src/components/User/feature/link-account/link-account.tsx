import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import { linkAccountThunk } from '../../../../redux/linkAccount/Thunk';
import { AppDispatch } from '../../../../redux/store'; 
import useToken from '../../../../services/link-account/token/useToken';
interface FormData {
  password: string;
}
const UserLinkAccount: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  const navigate = useNavigate(); 
  const [email, setEmail] = useState<string | null>(null);
  useToken(setEmail);
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!email || !token) {
      console.error('Email hoặc token không hợp lệ.');
      return;
    }
    try {
      const response = await dispatch(linkAccountThunk({ email, password: data.password, token }));
      if (response.meta.requestStatus === 'fulfilled') {
        navigate("/link-account-success");
      } else {
        setErrorMessage('Sai mật khẩu hoặc xảy ra lỗi khi liên kết tài khoản.'); 
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi khi liên kết tài khoản:', error);
      setErrorMessage('Đã xảy ra lỗi khi liên kết tài khoản.'); 
    }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Liên kết tài khoản
        </h2>
        <p className="mt-10 text-center text-sm text-gray-500">
          Email: <span className="font-semibold">{email}</span>
          đã đăng ký tài khoản E-Com, nếu bạn muốn
          liên kết với email đã có, vui lòng xác nhận mật khẩu.
        </p>

        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>} 
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Mật khẩu
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                id="password"
                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Liên kết tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLinkAccount;
