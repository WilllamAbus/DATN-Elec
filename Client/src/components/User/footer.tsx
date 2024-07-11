import React from 'react';
// import { Link } from 'react-router-dom';

const Footer :React.FC = () => {
    return (
        <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
            <div className="container grid grid-cols-1">
                <div className="col-span-1 space-y-4">
                  
                    <div className="mr-2"></div>
                    {/* <div className="flex space-x-5">
                        <a href="#" className="text-gray-400 hover:text-gray-500"><i className="fa-brands fa-facebook-square"></i></a>
                        <a href="#" className="text-gray-400 hover:text-gray-500"><i className="fa-brands fa-instagram-square"></i></a>
                        <a href="#" className="text-gray-400 hover:text-gray-500"><i className="fa-brands fa-twitter-square"></i></a>
                        <a href="#" className="text-gray-400 hover:text-gray-500"><i className="fa-brands fa-github-square"></i></a>
                    </div> */}
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Giải pháp</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Marketing</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Analitycs</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Commerce</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Insights</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Hỗ trợ</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Giá </a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Dịch vụ khách hàng</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Thanh toán</a>
                              
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mạng xã hội</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Facebook</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">X</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Tiktok</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Youtube</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Kiếm tiền</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Bán hàng</a>
                                <a href="#" className="text-base text-gray-500 hover:text-gray-900 block">Affiliate</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
