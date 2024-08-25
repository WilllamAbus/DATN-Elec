import React from "react";
import AdminListOrder from "../../../components/Admin/feature/orders/listOrders";

const listOrders: React.FC = () => {
  return (
    <div className="bg-gray-100 font-family-karla flex">
      <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
        <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <AdminListOrder />
        </div>
      </div>
    </div>
  );
};

export default listOrders;
