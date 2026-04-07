import React from "react";

interface BoxLeftDetailAuctionProps {
  children: React.ReactNode;
}

const BoxLeftDetailAuction: React.FC<BoxLeftDetailAuctionProps> = ({ children }) => {
  return (
    <div className="justify-center items-center bg-white shadow-sm rounded-lg p-4 sm:p-6 h-full">
      {children}
    </div>
  );
};

export default BoxLeftDetailAuction;
