import { Pagination } from "@nextui-org/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getAuctionWinsByUserThunk } from "../../../../redux/sessionAuction/thunk";
import AuctionPendingTable from "./table/auctionPendingTable";
import NoAuctionWin from "./noAuction/noAuctionWin";

export default function ListAuctionWin() {
  const dispatch = useDispatch<AppDispatch>();
  const currentPage = useSelector((state: RootState) => state.auctionWin.getAuctionWinsByUser.pagination?.currentPage || 1);
  const totalPages = useSelector((state: RootState) => state.auctionWin.getAuctionWinsByUser.pagination?.totalPages || 1);
  const auction = useSelector((state: RootState) => state.auctionWin.getAuctionWinsByUser.auctionWins || []);

  useEffect(() => {
    dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(getAuctionWinsByUserThunk({ page }));
  };

  return (
    <>
      {auction.length > 0 ? (
        <>
          <AuctionPendingTable
            auction={auction}
            dispatch={dispatch}
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
}
