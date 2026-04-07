import React from "react";

interface SectionDetailAuctionWrapperProps {
  children: React.ReactNode;
}

const SectionDetailAuctionWrapper: React.FC<SectionDetailAuctionWrapperProps> = ({ children }) => {
  return (
    <section className="py-10 bg-white dark:bg-gray-900 antialiased">
      <div className="max-w-screen-2xl px-4 mx-auto lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionDetailAuctionWrapper;
