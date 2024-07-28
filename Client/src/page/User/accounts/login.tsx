import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserHeader from '../../../components/User/header';
import UserNav from '../../../components/User/navbar';
import UserFooter from '../../../components/User/footer';
import UserCoppyright from '../../../components/User/copyright';
import authGoogleService from '../../../services/authentication/authGoogle.service';
import '../../../assets/css/user.style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { loginUser } from '~/redux/auth/apiRequest';
import { useDispatch } from 'react-redux';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newUser = {
            email: username,  
            password: password,
        };
        loginUser(newUser, dispatch, navigate);
    };

    return (
        <>
            <UserHeader />
            <UserNav />
            <div className="contain py-16">
                <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
                    <h2 className="text-2xl uppercase font-medium mb-1">Đăng nhập</h2>
                    <p className="text-gray-600 mb-6 text-sm">Chào mừng khách hàng quay trở lại</p>
                    <form id="addLoginButton" onSubmit={handleLogin} autoComplete="off">
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="email" className="text-gray-600 mb-2 block">Email</label>
                                <span id="emailRegisError" className="error"></span>
                                <input type="email" name="email" id="email"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="youremail.@domain.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password" className="text-gray-600 mb-2 block">Mật Khẩu</label>
                                <span id="passwordRegisError" className="error"></span>
                                <input type="password" name="password" id="password"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="Nhập mật khẩu....."
                                    value={password}
                                                        onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center">
                                {/* <input type="checkbox" name="remember" id="remember"
                                    className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                                <label htmlFor="remember" className="text-gray-600 ml-3 cursor-pointer">Remember me</label> */}
                            </div>
                            <Link to="/forgot" className="text-primary">Quên mật khẩu</Link>
                        </div>
                        <div className="mt-4">
                            <button type="submit"
                                className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium">
                                ĐĂNG NHẬP
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 flex justify-center relative">
                        <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">Or</div>
                        <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <a
                            className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700">
                            OTP
                        </a>
                        <button onClick={authGoogleService.loginWithGoogle} className="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500">
                            Google
                        </button>
                    </div>

                    <p className="mt-4 text-center text-gray-600">
                        Bạn chưa có tài khoản? <Link to="/register" className="text-primary">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
            <UserFooter />
            <UserCoppyright />
        </>
    );
};

export default Login;