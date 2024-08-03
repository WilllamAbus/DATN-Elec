import React from "react";


import listOne from "../../../../assets/images/products/product14.jpg";
import "../../../../assets/css/user.style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
const completePage: React.FC = () => {
  return (
    <>
   
      {/* <!-- breadcrumb --> */}
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base">
          <i className="fa-solid fa-house"></i>
        </a>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Complete</p>
      </div>
      {/* <!-- ./breadcrumb --> */}

      {/* <!-- wrapper --> */}
      <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        <div className="col-span-8 border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-medium capitalize mb-4">Hoàn thành thanh toán</h3>
          <div className="space-y-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={listOne} alt="product 1" className="w-28 h10 " />
                <h5 className="text-gray-800 font-medium">
                  Italian shape 
                </h5>
              </div>
              <p className="text-gray-600">x3</p>
                <p className="text-gray-800 font-medium">20.000 vnđ</p>
                <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={listOne} alt="product 1" className="w-28 h10 " />
                <h5 className="text-gray-800 font-medium">
                  Italian shape
                </h5>
              </div>
              <p className="text-gray-600">x3</p>
                <p className="text-gray-800 font-medium">20.000 vnđ</p>
                <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={listOne} alt="product 1" className="w-28 h10 " />
                <h5 className="text-gray-800 font-medium">
                  Italian shape 
                </h5>
              </div>
              <p className="text-gray-600">x3</p>
                <p className="text-gray-800 font-medium">20.000 vnđ</p>
                <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
            </div>
          </div>
        </div>

        <div className="col-span-4 border border-gray-200 p-4 rounded">
          <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
           Tổng thanh toán
          </h4>

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>Thanh toán</p>
            <p>128.000 vnđ</p>
          </div>

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>Vận chuyển</p>
            <p>Miễn phí</p>
          </div>

    

          <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
            <p className="font-semibold">Tổng thanh toán</p>
            <p>128.000 vnđ</p>
          </div>

          <a
            href="/"
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md 
                hover:bg-transparent hover:text-primary transition font-medium"
          >
            Hoàn thành thanh toán
          </a>
        </div>
      </div>
  
    </>
  );
};

export default completePage;
