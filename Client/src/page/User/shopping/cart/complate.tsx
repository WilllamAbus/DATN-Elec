import React from "react";

import UserHeader from "../../../../components/User/header";
import UserNav from "../../../../components/User/navbar";
import UserFooter from "../../../../components/User/footer";
import UserCoppyright from "../../../../components/User/copyright";
import "../../../../assets/css/user.style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
const cartPage: React.FC = () => {
  return (
    <>
      <UserHeader />
      <UserNav />
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
            <div className="flex justify-between">
              <div>
                <h5 className="text-gray-800 font-medium">
                  Italian shape sofa
                </h5>
                <p className="text-sm text-gray-600">Size: M</p>
              </div>
              <p className="text-gray-600">x3</p>
              <p className="text-gray-800 font-medium">$320</p>
              <div className="flex items-center">
                <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <h5 className="text-gray-800 font-medium">
                  Italian shape sofa
                </h5>
                <p className="text-sm text-gray-600">Size: M</p>
              </div>
              <p className="text-gray-600">x3</p>
              <p className="text-gray-800 font-medium">$320</p>
              <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                <i className="fa-sharp fa-solid fa-trash"></i>
              </button>
            </div>
            <div className="flex justify-between">
              <div>
                <h5 className="text-gray-800 font-medium">
                  Italian shape sofa
                </h5>
                <p className="text-sm text-gray-600">Size: M</p>
              </div>
              <p className="text-gray-600">x3</p>
              <p className="text-gray-800 font-medium">$320</p>
              <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                <i className="fa-sharp fa-solid fa-trash"></i>
              </button>
            </div>
            <div className="flex justify-between">
              <div>
                <h5 className="text-gray-800 font-medium">
                  Italian shape sofa
                </h5>
                <p className="text-sm text-gray-600">Size: M</p>
              </div>
              <p className="text-gray-600">x3</p>
              <p className="text-gray-800 font-medium">$320</p>
              <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                <i className="fa-sharp fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-4 border border-gray-200 p-4 rounded">
          <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            order summary
          </h4>

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>subtotal</p>
            <p>$1280</p>
          </div>

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>shipping</p>
            <p>Free</p>
          </div>

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>Discount</p>
            <p>$1280</p>
          </div>

          <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
            <p className="font-semibold">Total</p>
            <p>$1280</p>
          </div>

          <a
            href="/"
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md 
                hover:bg-transparent hover:text-primary transition font-medium"
          >
            Thanh toán
          </a>
        </div>
      </div>
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default cartPage;
