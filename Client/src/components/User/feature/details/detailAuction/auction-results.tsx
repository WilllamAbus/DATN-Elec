import { useState } from "react";
import AuctionWin from "./auctionWin";

const AuctionResults = () => {
  const [showAuctionWin,] = useState(true);



  return (
    <main className="bg-gradient-to-r from-[#015C92] to-[#2D82B5] dark:bg-gray-900">
      <div className="flex flex-col justify-center items-center px-6 mx-auto h-screen xl:px-0 dark:bg-gray-900">
        {showAuctionWin && <AuctionWin  />}
      </div>
    </main>
  );
};

export default AuctionResults;
