import React from "react";

import AdminFetAddBrands from "../../../components/Admin/feature/brands/addBrands";

const addBrands: React.FC = () => {
  return (
    <>
      <div className="bg-gray-100 font-family-karla flex">
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminFetAddBrands />
        </div>
      </div>     
    </>
  );
};

export default addBrands;
