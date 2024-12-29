import React from "react";
import { Tabs, Tab } from '@nextui-org/react';
import ListAuctionWin from './listAuctionWin';
import ChipCount from './ChipCount/ChipCount';
import { AuctionWin } from '../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser';
import { AppDispatch } from '../../../../redux/store';

interface AppAuctionProps {
  auction: AuctionWin[];
  dispatch: AppDispatch;
  currentPage: number;
}

const AppAuction: React.FC<AppAuctionProps> = ({ auction, dispatch, currentPage }) => {
  const tabs = [
    {
      id: 'Chờ xác nhận',
      label: 'Chờ xác nhận',
      content: <ListAuctionWin auction={auction} dispatch={dispatch} currentPage={currentPage} totalPages={1} />,
      confirmationStatus: 'pending',
      auctionStatus: ['won', 'pending'],
    },
    {
      id: 'Đã xác nhận',
      label: 'Đã xác nhận',
      content: 'Danh sách các đấu giá đã xác nhận.',
      confirmationStatus: 'confirmed',
      auctionStatus: [],
    },
    {
      id: 'Hủy',
      label: 'Hủy',
      content: 'Danh sách các đấu giá đã hủy.',
      confirmationStatus: 'canceled',
      auctionStatus: [],
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab
            key={item.id}
            title={
              <div className="flex items-center space-x-2">
                <span>{item.label}</span>
                <ChipCount
                  auction={auction}
                  confirmationStatus={item.confirmationStatus}
                  auctionStatus={item.auctionStatus}
                />
              </div>
            }
          >
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}

export default AppAuction;
