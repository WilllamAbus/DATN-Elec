import React from "react";
import AdminFooter from "../../../components/Admin/footer";
import AdminHeader from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminStyleSheet from "../../../components/Admin/stySheet";
import AdminFetEditBrands from "../../../components/Admin/feature/brands/editBrands";

import AdminScript from "../../../components/Admin/script";
import "../../../assets/css/admin.style.css";
const editBrands: React.FC = () => {
  return (
    <>
      <AdminStyleSheet />
      <div className="bg-gray-100 font-family-karla flex">
      <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <AdminFetEditBrands />
          <AdminFooter />
        </div>
        <AdminScript />
      </div>     
    </>
  );
};

export default editBrands;
