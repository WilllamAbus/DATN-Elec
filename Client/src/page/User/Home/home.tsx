import React from "react";
import { UserBanner } from "../../../components/User/banner";
import GetBestSell from "../../../components/User/best-sellings";
import GetRecommendation from "../../../components/User/recommendation";
import ListPhone from "src/components/User/feature/home/listPhone";
import ListLaptop from "src/components/User/feature/home/listLaptop";


const UserHome: React.FC = () => {

  return (
    <div>
      <UserBanner />
      <ListPhone/>
      <ListLaptop/>
      <GetRecommendation />
      <GetBestSell />
    </div>
  );
};

export default UserHome;
