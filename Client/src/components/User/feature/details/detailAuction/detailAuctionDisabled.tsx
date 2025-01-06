import React from "react";

interface DetailAuctionDisabledProps {
  children: React.ReactNode;
}

const DetailAuctionDisabled: React.FC<DetailAuctionDisabledProps> = ({ children }) => {
  return (
    <div className="opacity-50 pointer-events-none">
      {children}
    </div>
  );
};

export default DetailAuctionDisabled;
