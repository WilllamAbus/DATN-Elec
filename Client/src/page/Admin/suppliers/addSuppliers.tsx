import React from "react";
import AdminFetAddSuppliers from "../../../components/Admin/feature/suppliers/addSuppliers";

const addSuppliers: React.FC = () => {
  return (
    <>
      <div className="bg-gray-100 font-family-karla flex">
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminFetAddSuppliers />
        </div>
      </div>     
    </>
  );
};

export default addSuppliers;
