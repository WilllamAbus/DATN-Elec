import React from 'react';
// import { Link } from 'react-router-dom';

const Footer :React.FC = () => {
    return (
        <footer className="bg-upFot pt-16 pb-12 border-t border-gray-100">
            <div className="container grid grid-cols-1">
                <div className="col-span-1 space-y-4">
                  
                    <div className="mr-2"></div>
                    {/* <div className="flex space-x-5">
                        <a href="#" className="text-white hover:text-white"><i className="fa-brands fa-facebook-square"></i></a>
                        <a href="#" className="text-white hover:text-white"><i className="fa-brands fa-instagram-square"></i></a>
                        <a href="#" className="text-white hover:text-white"><i className="fa-brands fa-twitter-square"></i></a>
                        <a href="#" className="text-white hover:text-white"><i className="fa-brands fa-github-square"></i></a>
                    </div> */}
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Giải pháp</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-white block">Marketing</a>
                                <a href="#" className="text-base text-white block">Analitycs</a>
                                <a href="#" className="text-base text-white block">Commerce</a>
                                <a href="#" className="text-base text-white block">Insights</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Hỗ trợ</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-white block">Giá </a>
                                <a href="#" className="text-base text-white block">Dịch vụ khách hàng</a>
                                <a href="#" className="text-base text-white block">Thanh toán</a>
                              
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Mạng xã hội</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-white block">Facebook</a>
                                <a href="#" className="text-base text-white block">X</a>
                                <a href="#" className="text-base text-white block">Tiktok</a>
                                <a href="#" className="text-base text-white block">Youtube</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Kiếm tiền</h3>
                            <div className="mt-4 space-y-4">
                                <a href="#" className="text-base text-white block">Bán hàng</a>
                                <a href="#" className="text-base text-white block">Affiliate</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
