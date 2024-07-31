import React from "react";


import listOne from "../../../../assets/images/products/product14.jpg";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
const cartPage: React.FC = () => {
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
        <p className="text-gray-600 font-medium">Checkout</p>
      </div>
      {/* <!-- ./breadcrumb --> */}

      {/* <!-- wrapper --> */}
      <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        <div className="col-span-8 border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
          <div className="space-y-4">
            <form action="" method="post">
              <div>
                <label className="text-gray-600">
                  Tên người nhận <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  className="input-box"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="input-box"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Thành Phố</label>
                  <select name="city" id="city" className="input-box">
                  
                    <option value="hanoi">Cần Thơ</option>
                    <option value="hochiminh">Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                    <option value="haiphong">Hải Phòng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600">SĐT </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="input-box"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Email </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="input-box"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-gray-600" htmlFor="payment">
                  Phương thức thanh toán
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="payment"
                    id="momo"
                    className="mr-2"
                  />
                  <label htmlFor="momo" className="text-gray-600">
                    MoMo
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="payment"
                    id="direct"
                    className="mr-2"
                  />
                  <label htmlFor="direct" className="text-gray-600">
                    Thanh toán trực tiếp
                  </label>
                </div>
              </div>
            </form>

            {/* <div>
                    <label  className="text-gray-600">Company</label>
                    <input type="text" name="company" id="company" className="input-box"/>
                </div> */}
            {/* <div>
                    <label  className="text-gray-600">Country/Region</label>
                    <input type="text" name="region" id="region" className="input-box"/>
                </div> */}
          </div>
        </div>

        <div className="col-span-4 border border-gray-200 p-4 rounded">
          <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Tổng thanh toán
          </h4>
          <div className="space-y-2">
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

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>Thanh toán</p>
            <p>128.000 vnđ</p>
          </div>

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>Vận chuyển</p>
            <p>Miễn phí</p>
          </div>

          <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
            <p className="font-semibold">Tổng cộng</p>
            <p>128.000 vnđ</p>
          </div>

          {/* <div className="flex items-center mb-4 mt-2">
                <input type="checkbox" name="aggrement" id="aggrement"
                    className="text-primary focus:ring-0 rounded-sm cursor-pointer w-3 h-3"/>
                <label  className="text-gray-600 ml-3 cursor-pointer text-sm">I agree to the <a href="#"
                        className="text-primary">terms & conditions</a></label>
            </div> */}

          <a
            href="/complete"
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
          >
            Thanh Toán
          </a>
        </div>
      </div>
      {/* <!-- ./wrapper --> */}
   
    </>
  );
};

export default cartPage;
