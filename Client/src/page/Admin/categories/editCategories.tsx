import React from "react";
import AdminFooter from "../../../components/Admin/footer";
import AdminHeader from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminStyleSheet from "../../../components/Admin/stySheet";

import AdminScript from "../../../components/Admin/script";
import "../../../assets/css/admin.style.css";
const editCate: React.FC = () => {
  return (
    <>
      <AdminStyleSheet />

      <div className="bg-gray-100 font-family-karla flex">
      <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <main className="w-full flex-grow p-6">
            

            <div className="flex flex-wrap">
                <div className="w-full mt-6 pl-0 lg:pl-2">
                    <p className="text-lg text-gray-800 font-medium pb-4">THÔNG TIN DANH MỤC</p>
                    <div className="leading-loose">
                        <form id="addNewForm" className="p-10 bg-white rounded shadow-xl" action="" method="post" encType="multipart/form-data">
                            <div className="">
                                <label className="block text-sm text-gray-600" htmlFor="cus_name">Name</label>
                                <span id="nameCateError" className="error"></span>
                                <input className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="cus_name" name="nameCate" type="text" />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm text-gray-600" htmlFor="cus_img">Hình</label>
                                <span id="cateImgError" className="error"></span>
                                <input className="w-full px-5 py-4 text-gray-700 bg-gray-200 rounded" type="file" id="cus_img" name="imgCate" />
                            </div>
                            <div className="mt-6 flex gap-2">
                                <button id="addNewButton" type="submit" className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded">Thêm mới</button>
                                <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="button">
                                    <a href="/admin/categories/listCate">Danh sách</a>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>

            <AdminFooter />
          </div>
        </div>
        <AdminScript />


      </div>
     
     
    </>
  );
};

export default editCate;