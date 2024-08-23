import React from "react";

import AdminFetListSuppliers from "../../../components/Admin/feature/suppliers/listSuppliers";
const listSuppliers: React.FC = () => {
  return (
    <>
      <div className="bg-gray-100 font-family-karla flex">
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminFetListSuppliers />
        </div>
      </div>     
    </>
  );
};

export default listSuppliers;
