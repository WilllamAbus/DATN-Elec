import React from "react";

import AdminDetailOrderAuctionCash from "../../../components/Admin/feature/orderAuctions/detailsOrderCash";

const listOrdersDetailsCash: React.FC = () => {
  return (
    <div className="bg-gray-100 font-family-karla flex">
      <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
        <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <AdminDetailOrderAuctionCash />
        </div>
      </div>
    </div>
  );
};

export default listOrdersDetailsCash;