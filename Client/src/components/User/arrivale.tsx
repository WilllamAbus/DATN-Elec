import React from 'react';
import prodSelOne from '../../assets/images/products/product14.jpg'

import prodSelTwo from '../../assets/images/products/product15.png'
import prodSelThree from '../../assets/images/products/product14.jpg'
import prodSelFour from '../../assets/images/products/product19.png'
const Arrivale : React.FC = () => {
    return (
        <div className="container pb-16">
            <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Bán chạy</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white shadow rounded overflow-hidden group">
                    <div className="relative">
                        <img src={prodSelOne} alt="product 1" className="w-80 h-2" />
                        <div className="absolute inset-0  flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                            {/* <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="view product">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </a>
                            <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="add to wishlist">
                                <i className="fa-solid fa-heart"></i>
                            </a> */}
                        </div>
                    </div>
                    <div className="pt-4 pb-3 px-4">
                        <a href="/">
                            <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">Quạt tản nhiệt </h4>
                        </a>
                        <div className="flex items-baseline mb-1 space-x-2">
                            <p className="text-xl text-primary font-semibold">450.000 vnđ</p>
                            <p className="text-sm text-gray-400 line-through">555.900 vnđ</p>
                        </div>
                        <div className="flex items-center">
                            <div className="flex gap-1 text-sm text-yellow-400">
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                            </div>
                            <div className="text-xs text-gray-500 ml-3">(150)</div>
                        </div>
                    </div>
                    <a href="#"
                        className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
                        Add to cart
                    </a>
                </div>

                <div className="bg-white shadow rounded overflow-hidden group">
                    <div className="relative">
                        <img src={prodSelTwo} alt="product 1" className="w-50 h-1" />
                        <div className="absolute inset-0  flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                            {/* <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="view product">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </a>
                            <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="add to wishlist">
                                <i className="fa-solid fa-heart"></i>
                            </a> */}
                        </div>
                    </div>
                    <div className="pt-4 pb-3 px-4">
                        <a href="#">
                            <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">Card đồ họa GTX</h4>
                        </a>
                        <div className="flex items-baseline mb-1 space-x-2">
                            <p className="text-xl text-primary font-semibold">450.000 vnđ</p>
                            <p className="text-sm text-gray-400 line-through">555.900 vnđ</p>
                        </div>
                        <div className="flex items-center">
                            <div className="flex gap-1 text-sm text-yellow-400">
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                            </div>
                            <div className="text-xs text-gray-500 ml-3">(150)</div>
                        </div>
                    </div>
                    <a href="#"
                        className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
                        Add to cart
                    </a>
                </div>

                <div className="bg-white shadow rounded overflow-hidden group">
                    <div className="relative">
                        <img src={prodSelThree} alt="product 1" className="w-80" />
                        <div className="absolute inset-0  flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                            {/* <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="view product">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </a>
                            <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="add to wishlist">
                                <i className="fa-solid fa-heart"></i>
                            </a> */}
                        </div>
                    </div>
                    <div className="pt-4 pb-3 px-4">
                        <a href="#">
                            <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">DRONE</h4>
                        </a>
                        <div className="flex items-baseline mb-1 space-x-2">
                            <p className="text-xl text-primary font-semibold">450.000 vnđ</p>
                            <p className="text-sm text-gray-400 line-through">555.900 vnđ</p>
                        </div>
                        <div className="flex items-center">
                            <div className="flex gap-1 text-sm text-yellow-400">
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                            </div>
                            <div className="text-xs text-gray-500 ml-3">(150)</div>
                        </div>
                    </div>
                    <a href="#"
                        className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
                        Add to cart
                    </a>
                </div>

                <div className="bg-white shadow rounded overflow-hidden group">
                    <div className="relative">
                        <img src={prodSelFour} alt="product 1" className="w-80" />
                        <div className="absolute inset-0  flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                            {/* <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="view product">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </a>
                            <a href="#"
                                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                                title="add to wishlist">
                                <i className="fa-solid fa-heart"></i>
                            </a> */}
                        </div>
                    </div>
                    <div className="pt-4 pb-3 px-4">
                        <a href="#">
                            <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">DRONE X</h4>
                        </a>
                        <div className="flex items-baseline mb-1 space-x-2">
                            <p className="text-xl text-primary font-semibold">450.000 vnđ</p>
                            <p className="text-sm text-gray-400 line-through">555.900 vnđ</p>
                        </div>
                        <div className="flex items-center">
                            <div className="flex gap-1 text-sm text-yellow-400">
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                                <span><i className="fa-solid fa-star"></i></span>
                            </div>
                            <div className="text-xs text-gray-500 ml-3">(150)</div>
                        </div>
                    </div>
                    <a href="#"
                        className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
                        Add to cart
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Arrivale;
