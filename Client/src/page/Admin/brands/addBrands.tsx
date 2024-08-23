import React from "react";
import AdminFooter from "../../../components/Admin/footer";
import AdminHeader from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminStyleSheet from "../../../components/Admin/stySheet";
import AdminFetAddBrands from "../../../components/Admin/feature/brands/addBrands";

import AdminScript from "../../../components/Admin/script";
import "../../../assets/css/admin.style.css";
const addBrands: React.FC = () => {
  return (
    <>
      <AdminStyleSheet />
      <div className="bg-gray-100 font-family-karla flex">
      <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <AdminFetAddBrands />
          <AdminFooter />
        </div>
        <AdminScript />
      </div>     
    </>
  );
};

export default addBrands;
