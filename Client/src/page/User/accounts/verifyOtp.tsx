import React from 'react';
import { Link } from 'react-router-dom';

const verifyOTP: React.FC = () => {
    return (
        <>
            <div className="contain py-16">
                <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
                    <h2 className="text-2xl uppercase font-medium mb-1">Đăng Ký</h2>
                    <p className="text-gray-600 mb-6 text-sm">Welcome back customer</p>
                    <form id="addLoginButton" action="" method="post" autoComplete="off">
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="email" className="text-gray-600 mb-2 block">Email address</label>
                                <span id="emailRegisError" className="error"></span>
                                <input type="email" name="email" id="email"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="youremail.@domain.com" />
                            </div>

                           <div>
                                <label htmlFor="password" className="text-gray-600 mb-2 block">OTP</label>
                                <span id="passRegisError" className="error"></span>
                                <input type="text" name="password" id="password"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="*******" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center">
                                {/* <input type="checkbox" name="remember" id="remember"
                                    className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                                <label htmlFor="remember" className="text-gray-600 ml-3 cursor-pointer">Remember me</label> */}
                            </div>
                            <a href="#" className="text-primary">Quên mật khẩu</a>
                        </div>
                        <div className="mt-4">
                            <Link to='/'>
                            
                            <button type="submit"
                                className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium">
                                ĐĂNG NHẬP
                            </button>
                            </Link>
                          
                        </div>
                    </form>

                    <div className="mt-6 flex justify-center relative">
                        <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">Or</div>
                        <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <a href="/regisOTP"
                            className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700">
                              OTP
                        </a>
                        <a href="#"
                            className="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500">
                            Google
                        </a>
                   
                    </div>

                    <p className="mt-4 text-center text-gray-600">
                        Bạn chưa có tài khoản? <Link to="/register" className="text-primary">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>

        </>
    );
};

export default verifyOTP;