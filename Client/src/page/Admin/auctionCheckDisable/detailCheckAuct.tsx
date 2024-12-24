import React from "react";

import AdminDetailCheckAuct 
from "../../../components/Admin/feature/auctionCheckDisable/detailIsCheckAuct";

const listCheckAuct: React.FC = () => {
  return (
    <div className="bg-gray-100 font-family-karla flex">
      <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
        <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <AdminDetailCheckAuct />
        </div>
      </div>
    </div>
  );
};

export default listCheckAuct;