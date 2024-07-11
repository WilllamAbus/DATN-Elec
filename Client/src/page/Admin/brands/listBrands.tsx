import React from "react";
import AdminFooter from "../../../components/Admin/footer";
import AdminHeader from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminStyleSheet from "../../../components/Admin/stySheet";

import AdminScript from "../../../components/Admin/script";
import "../../../assets/css/admin.style.css";
const listBrands: React.FC = () => {
  return (
    <>
      <AdminStyleSheet />

      <div className="bg-gray-100 font-family-karla flex">
      <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <main className="w-full flex-grow p-6">
             
            
            
                <div className="w-full mt-12">
                    <p className="text-xl pb-3 flex items-center">
                        <i className="fas fa-list mr-3"></i> DANH SÁCH THƯƠNG HIỆU
                    </p>
                    <div className="bg-white overflow-auto">
                        <table className="text-left w-full border-collapse"> 
                            <thead>
                                <tr>
                                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">ID</th>
                                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">NAME CATE</th>
                                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">IMG</th>
                                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr className="hover:bg-grey-lighter">
                                        <td className="py-4 px-6 border-b border-grey-light"></td>
                                        <td className="py-4 px-6 border-b border-grey-light"></td>
                                      
                                        <td className="py-4 px-6 border-b border-grey-light">
                                            <img src="" className="width: 50px; height: 50px;"/></td>
                                       
                                      
                                        <td>
                                            <a href="#" 
                                            className="delete-link cta-btn btn text-decoration:none;color:green;"  
                                          >Xoá</a>
                                            <a  href="/admin/editBrands"className="delete-link p-4 cta-btn btn text-decoration:none;color:green;" >Sửa</a>
                                        </td>
                                    </tr>
                          
                             
                            </tbody>
                        </table>
                      
                    </div>
                
                </div>
            
                <div className="mt-6 flex gap-2">
                    <button className=" px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="submit"><a href="/admin/addBrands">Thêm mới</a></button>
                    <button className=" px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="submit"><a href="/admin/dashboard">Trở lại</a></button>
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

export default listBrands;
