import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import AppAuction from "./auctionApp";
import { getAuctionWinsByUserThunk } from "../../../../redux/sessionAuction/thunk";

const AuctionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentPage = useSelector((state: RootState) => state.auctionWin.getAuctionWinsByUser.pagination?.currentPage || 1);

  React.useEffect(() => {
    dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
  }, [dispatch, currentPage]);

  return (
    <>
      <div className="p-1 mb-4 m-4 bg-[#d5e7f2] rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="flex ml-3 items-center gap-2 mb-3">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2Fdsatdg.svg?alt=media&token=c57cd4ab-096f-4352-a29d-f4076b127968"
            alt="Icon"
            className="w-10 h-10 bg-none"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Phiên đấu giá
          </h1>
        </div>
        <div className="max-w-screen-2xl px-4 mx-auto lg:px-1">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-start dark:bg-gray-900">
            <div className="col-span-full">
              <AppAuction currentPage={currentPage} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionPage;
