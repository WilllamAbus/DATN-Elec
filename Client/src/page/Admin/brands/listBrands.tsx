import React from "react";

import AdminFetListProducts from "../../../components/Admin/feature/brands/listBrands";

const listBrands: React.FC = () => {
  return (
    <>
      <div className="bg-gray-100 font-family-karla flex">
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminFetListProducts />
        </div>
      </div>
     
     
    </>
  );
};

export default listBrands;
