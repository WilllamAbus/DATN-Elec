import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
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
        <a
          href="/admin/listCategories"
          className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
        >
          <i className="fas fa-sticky-note mr-3"></i>
          Danh mục
        </a>
        <div className="flex flex-col">
          <button
            onClick={toggleProducts}
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            <i className="fas fa-table mr-3"></i>
            Mua sắm
            <i className={`fas fa-chevron-${isProductsOpen ? 'up' : 'down'} ml-2`}></i>
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
                href="/admin/listDiscounts"
                className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Mã giảm giá
              </a>
            </div>
          )}
        </div>
        <a
          href="/admin/listUser"
          className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
        >
          <i className="fas fa-align-left mr-3"></i>
          Người dùng
        </a>
        <a
          href="/admin/listComments"
          className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
        >
          <i className="fas fa-tablet-alt mr-3"></i>
          Bình luận
        </a>
        <a
          href="/admin/listCusSer"
          className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
        >
          <i className="fas fa-align-left mr-3"></i>
          Dịch vụ khách hàng
        </a>
        <a
          href="/admin/listBrands"
          className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
        >
          <i className="fas fa-calendar mr-3"></i>
          Thương hiệu
        </a>
        <a
          href="/admin/listOrders"
          className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
        >
          <i className="fas fa-calendar mr-3"></i>
          Đơn hàng
        </a>
        <a
          href="/admin/recycleBin"
          className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
        >
          <i className="fas fa-calendar mr-3"></i>
          Thùng rác
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
