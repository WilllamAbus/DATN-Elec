import React from "react";
import AdminFooter from "../../../components/Admin/footer";
import AdminHeader from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminStyleSheet from "../../../components/Admin/stySheet";
import AdminFetsoftDeleteList from "../../../components/Admin/feature/products/softDeleteList";
import AdminScript from "../../../components/Admin/script";
import "../../../assets/css/admin.style.css";

const recycleBin: React.FC = () => {
  return (
    <>
      <AdminStyleSheet />
      <div className="bg-gray-100 font-family-karla flex">
        <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
            <AdminFetsoftDeleteList />
            <AdminFooter />
          </div>
        </div>
        <AdminScript />
      </div>
    </>
  );
};

export default recycleBin;
