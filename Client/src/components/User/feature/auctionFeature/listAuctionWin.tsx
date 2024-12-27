import React from "react";
import { Pagination } from "@nextui-org/react";
import AuctionPendingTable from "./table/auctionPendingTable";
import NoAuctionWin from "./noAuction/noAuctionWin";
import { AppDispatch } from "../../../../redux/store";
import { AuctionWin } from "../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
import { getAuctionWinsByUserThunk } from "../../../../redux/sessionAuction/thunk";

interface ListAuctionWinProps {
  auction: AuctionWin[];
  dispatch: AppDispatch;
  currentPage: number;
  totalPages: number;
}

const ListAuctionWin: React.FC<ListAuctionWinProps> = ({ auction, dispatch, currentPage, totalPages }) => {
  const handlePageChange = (page: number) => {
    dispatch(getAuctionWinsByUserThunk({ page }));
  };

  return (
    <>
      {auction.length > 0 ? (
        <>
          <AuctionPendingTable
            auction={auction}
            currentPage={currentPage}
          />
          {totalPages > 1 && (
            <div className="flex justify-center my-4">
              <Pagination
                isCompact
                loop
                showControls
                color="primary"
                total={totalPages}
                initialPage={currentPage}
                onChange={(page) => handlePageChange(page)}
              />
            </div>
          )}
        </>
      ) : (
        <NoAuctionWin />
      )}
    </>
  );
};

export default ListAuctionWin;
