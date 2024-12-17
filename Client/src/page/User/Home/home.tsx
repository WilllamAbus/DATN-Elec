import React from "react";
import { UserBanner } from "../../../components/User/banner";
import GetBestSell from "../../../components/User/best-sellings";
import GetRecommendation from "../../../components/User/recommendation";
import ListPhone from "src/components/User/feature/home/listPhone";


const UserHome: React.FC = () => {

  return (
    <div>
      <UserBanner />
      <ListPhone/>
      <GetRecommendation />
      <GetBestSell />
    </div>
  );
};

export default UserHome;
