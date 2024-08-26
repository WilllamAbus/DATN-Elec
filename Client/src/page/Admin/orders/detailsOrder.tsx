import React from "react";

import AdminDetailOrder from "../../../components/Admin/feature/orders/detailOrders";

const listOrdersDetails: React.FC = () => {
  return (
    <div className="bg-gray-100 font-family-karla flex">
      <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
        <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <AdminDetailOrder />
        </div>
      </div>
    </div>
  );
};

export default listOrdersDetails;
