import React from "react";
import AdminFooter from "../../../components/Admin/footer";
import AdminHeader from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminStyleSheet from "../../../components/Admin/stySheet";
import AdminListOrder from "../../../components/Admin/feature/orders/listOrders";
import AdminScript from "../../../components/Admin/script";
import "../../../assets/css/admin.style.css";
const listOrders: React.FC = () => {
  return (
    <>
      <AdminStyleSheet />

      <div className="bg-gray-100 font-family-karla flex">
      <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <AdminListOrder/>

            <AdminFooter />
          </div>
        </div>
        <AdminScript />


      </div>
     
     
    </>
  );
};

export default listOrders;