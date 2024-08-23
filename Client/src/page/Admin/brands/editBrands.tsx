import React from "react";
import AdminFetEditBrands from "../../../components/Admin/feature/brands/editBrands";

const editBrands: React.FC = () => {
  return (
    <>
      <div className="bg-gray-100 font-family-karla flex">
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminFetEditBrands />
        </div>
      </div>     
    </>
  );
};

export default editBrands;
