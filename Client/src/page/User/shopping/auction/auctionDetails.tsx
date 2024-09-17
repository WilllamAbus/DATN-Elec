import React from 'react';
import { useParams } from "react-router-dom";

import UserAuctDetails from '../../../../components/User/feature/details/auctions/auctionsDetail'
const AuctionDetails:  React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
  
    if (!productId) {
      return <p>Product ID is missing!</p>;
    }
    return (
        <>
       <UserAuctDetails productId={productId}   />
        </>
    );
};

export default AuctionDetails;
