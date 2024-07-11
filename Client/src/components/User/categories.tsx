import React from 'react';
import { Link } from 'react-router-dom';
import cateOne from "../../assets/images/category/category-1 1.jpg"
import cateTwo from "../../assets/images/category/category-3 1.jpg"
import cateThree from "../../assets/images/category/category-7 1.jpg"

import cateFour from "../../assets/images/category/category-4.jpg"
import cateFive from "../../assets/images/category/category-5.jpg"
import cateSix from "../../assets/images/category/category-6.jpg"
const Categories: React.FC = () => {
    return (
        <div className="container py-16">
            <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">shop by category</h2>
            <div className="grid grid-cols-3 gap-3">
                <Link to="#" className="relative rounded-sm overflow-hidden group">
                    <img src={cateOne} alt="category 1" className="w-full" />
                    {/* <a href="#"
                        className="absolute inset-0   flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition">Giường ngủ</a> */}
                </Link>
                <Link to="#" className="relative rounded-sm overflow-hidden group">
                    <img src={cateTwo} alt="category 2" className="w-full" />
                    {/* <a href="#"
                        className="absolute inset-0   flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition">Mattrass</a> */}
                </Link>
                <div className="relative rounded-sm overflow-hidden group">
                    <img src={cateThree} alt="category 3" className="w-full" />
                    {/* <a href="#"
                        className="absolute inset-0  flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition">Ban công</a> */}
                </div>
                <div className="relative rounded-sm overflow-hidden group">
                    <img src={cateFour} alt="category 4" className="w-full" />
                    {/* <a href="#"
                        className="absolute inset-0  flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition">Sofa</a> */}
                </div>
                <div className="relative rounded-sm overflow-hidden group">
                    <img src={cateFive} alt="category 5" className="w-full" />
                    {/* <a href="#"
                        className="absolute inset-0  flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition">Phòng khách</a> */}
                </div>
                <div className="relative rounded-sm overflow-hidden group">
                    <img src={cateSix} alt="category 6" className="" />
                    {/* <a href="#"
                        className="absolute inset-0  flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition">Nhà bếp</a> */}
                </div>
            </div>
        </div>
    );
};

export default Categories;
