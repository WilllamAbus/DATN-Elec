import React from 'react';
import { Chip } from '@nextui-org/react';
import { AuctionWin } from '../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser';

interface ChipCountProps {
  auction: AuctionWin[];
  confirmationStatus: string;
  auctionStatus?: string[];
}

const ChipCount: React.FC<ChipCountProps> = ({ auction, confirmationStatus, auctionStatus = [] }) => {
  const count = auction.filter(item => item.confirmationStatus === confirmationStatus && auctionStatus.includes(item.auctionStatus)).length;

  return (
    <Chip size="sm" variant="faded">
      {count}
    </Chip>
  );
};

export default ChipCount;
