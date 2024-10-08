import React from "react";

import AdminDetailOrderAuction from "../../../components/Admin/feature/orderAuctions/detailsOrders";

const listOrdersDetails: React.FC = () => {
  return (
    <div className="bg-gray-100 font-family-karla flex">
      <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
        <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <AdminDetailOrderAuction />
        </div>
      </div>
    </div>
  );
};

export default listOrdersDetails;