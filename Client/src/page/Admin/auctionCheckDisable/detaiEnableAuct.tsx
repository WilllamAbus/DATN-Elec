import React from "react";

import AdminDetailEnableAuct 
from "../../../components/Admin/feature/auctionCheckDisable/enableAuct/detalEnableAuct";

const listEnableDetails: React.FC = () => {
  return (
    <div className="bg-gray-100 font-family-karla flex">
      <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
        <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
          <AdminDetailEnableAuct />
        </div>
      </div>
    </div>
  );
};

export default listEnableDetails;