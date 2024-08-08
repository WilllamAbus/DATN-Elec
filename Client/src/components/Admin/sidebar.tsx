import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  const [isCateOpen, setIsCateOpen] = useState(false);

  const toggleCate = () => {
    setIsCateOpen(!isCateOpen);
  };

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const [isInteractOpen, setIsInteractOpen] = useState(false);

  const toggleInteract = () => {
    setIsInteractOpen(!isInteractOpen);
  };

  const [isServiceOpen, setServiceOpen] = useState(false);

  const toggleService = () => {
    setServiceOpen(!isServiceOpen);
  };
  const [isOrderOpen, setOrderOpen] = useState(false);

  const toggleOrder = () => {
    setOrderOpen(!isOrderOpen);
  };

  const [isRestoreOpen, setRestoreOpen] = useState(false);

  const toggleRestore = () => {
    setRestoreOpen(!isRestoreOpen);
  };

  return (
    <aside className="relative bg-sidebar h-screen w-64 hidden sm:block shadow-xl">
      <div className="p-6">
        <a
          href="/admin/dashboard"
          className="text-black text-3xl font-semibold uppercase hover:text-black-300"
        >
          Admin
        </a>
        <button className="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
          <i className="fas fa-plus mr-3"></i> New Report
        </button>
      </div>
      <nav className="text-black text-base font-semibold pt-3">
        <a
          href="/admin/dashboard"
          className="flex items-center active-nav-link text-black py-4 pl-6 nav-item"
        >
          <i className="fas fa-tachometer-alt mr-3"></i>
          Dashboard
        </a>

        <div className="flex flex-col">
          <button
            onClick={toggleCate}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Danh mục
            <i
              className={`fas fa-chevron-${isCateOpen ? "up" : "down"} ml-2`}
            ></i>
          </button>
          {isCateOpen && (
            <div className="pl-6">
              <a
                href="/admin/listCategories"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-sticky-note mr-3"></i>
                Danh mục
              </a>

          
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <button
            onClick={toggleProducts}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Mua sắm
            <i
              className={`fas fa-chevron-${
                isProductsOpen ? "up" : "down"
              } ml-2`}
            ></i>
          </button>
          {isProductsOpen && (
            <div className="pl-6">
              <a
                href="/admin/listProducts"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Sản phẩm
              </a>
              <a
                href="/admin/listBuyingFormat"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Sản phẩm đấu giá
              </a>
              <a
                href="/admin/listCondition"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Điều kiện đấu giá
              </a>
              <a
                href="/admin/listVouchers"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Mã giảm giá
              </a>
              <a
                href="/admin/listBrands"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Thương hiệu
              </a>
       
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <button
            onClick={toggleAccount}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Tài khoản
            <i
              className={`fas fa-chevron-${isAccountOpen ? "up" : "down"} ml-2`}
            ></i>
          </button>
          {isAccountOpen && (
            <div className="pl-6">
              <a
                href="/admin/listUser"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-align-left mr-3"></i>
                Người dùng
              </a>
            </div>
          )}
          {isAccountOpen && (
            <div className="pl-6">
              <a
                href="/admin/listDelete"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-align-left mr-3"></i>
                Tài khoản đã khóa
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <button
            onClick={toggleInteract}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Tương tác
            <i
              className={`fas fa-chevron-${
                isInteractOpen ? "up" : "down"
              } ml-2`}
            ></i>
          </button>
          {isInteractOpen && (
            <div className="pl-6">
              <a
                href="/admin/listComments"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-tablet-alt mr-3"></i>
                Bình luận
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <button
            onClick={toggleService}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Dịch vụ
            <i
              className={`fas fa-chevron-${isServiceOpen ? "up" : "down"} ml-2`}
            ></i>
          </button>
          {isServiceOpen && (
            <div className="pl-6">
              <a
                href="/admin/listCusSer"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-align-left mr-3"></i>
                Dịch vụ khách hàng
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <button
            onClick={toggleOrder}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Đơn hàng
            <i
              className={`fas fa-chevron-${isOrderOpen ? "up" : "down"} ml-2`}
            ></i>
          </button>
          {isOrderOpen && (
            <div className="pl-6">
              <a
                href="/admin/listOrders"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Đơn hàng
              </a>
            </div>
          )}
        </div>


        <div className="flex flex-col">
          <button
            onClick={toggleRestore}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Khôi phục dữ liệu
            <i
              className={`fas fa-chevron-${isRestoreOpen ? "up" : "down"} ml-2`}
            ></i>
          </button>
          {isRestoreOpen && (
            <div className="pl-6">
                  <a
                href="/admin/recycleBin"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Sản phẩm
              </a>

              <a
                href="/admin/recycleBinCate"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Danh mục
              </a>

              <a
                href="/admin/recycleBinCate"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Đơn hàng
              </a>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
