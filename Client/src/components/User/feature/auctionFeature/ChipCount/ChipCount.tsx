import React from 'react';
import { Chip } from '@nextui-org/react';
import { useSelector } from "react-redux";
import { RootState } from '../../../../../redux/store';

interface ChipCountProps {
  confirmationStatus: string;
  auctionStatus?: string[];
}

const ChipCount: React.FC<ChipCountProps> = ({ confirmationStatus, auctionStatus = [] }) => {
  const auctions = useSelector((state: RootState) => state.auctionWin.getAuctionWinsByUser.auctionWins ?? []);
  const count = auctions.filter(item => item.confirmationStatus === confirmationStatus && auctionStatus.includes(item.auctionStatus)).length;

  return (
    <Chip size="sm" variant="faded">
      {count}
    </Chip>
  );
};

export default ChipCount;
