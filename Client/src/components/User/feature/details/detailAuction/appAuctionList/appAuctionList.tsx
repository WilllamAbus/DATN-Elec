import React from 'react';
import AuctionList from './auctionList';
import { Bid } from "../../../../../../services/detailProductAuction/types/getAuctionProgress";


interface AppAuctionListProps {
  currentPage: number;
  totalPages: number;
  total: number;
  handlePageChange: (newPage: number) => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  biddingList: Bid[];
  isLoading: boolean;
}

const AppAuctionList: React.FC<AppAuctionListProps> = ({ currentPage, totalPages, handlePageChange, hasPrevPage, hasNextPage, biddingList, isLoading, total }) => {
  return (
    <AuctionList
      currentPage={currentPage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
      hasPrevPage={hasPrevPage}
      hasNextPage={hasNextPage}
      biddingList={biddingList}
      isLoading={isLoading} 
      total={total}
    />
  );
};

export default AppAuctionList;
