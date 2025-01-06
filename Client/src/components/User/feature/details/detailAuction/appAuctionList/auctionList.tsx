import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import AuctionListTitle from "./title/auctionListTitle";
import PaginationControls from "./Controls/PaginationControls";
import AuctionListTable from "./table/AuctionListTable";
import { Bid } from "../../../../../../services/detailProductAuction/types/getAuctionProgress";

interface AuctionListProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  biddingList: Bid[];
  isLoading: boolean; 
  total: number; 
}

const AuctionList: React.FC<AuctionListProps> = ({ currentPage, totalPages, handlePageChange, hasPrevPage, hasNextPage, biddingList, isLoading, total }) => {
  return (
    <Card className="max-w-full shadow-none bg-white">
      <CardHeader className="justify-between">
        <AuctionListTitle />
      </CardHeader>
      <CardBody className="px-1 py-1 text-small text-default-400">
        <AuctionListTable biddingList={biddingList} isLoading={isLoading} total={total} /> 
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
        />
      </CardBody>
    </Card>
  );
};

export default AuctionList;
