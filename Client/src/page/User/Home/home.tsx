import React from "react";
import { UserBanner } from "../../../components/User/banner";
import UserFeature from "../../../components/User/feeture";
import UserArrivale from "../../../components/User/arrivale";
import GetRecommendation from "../../../components/User/recommendation";
import ListPhone from "src/components/User/feature/home/listPhone";


const UserHome: React.FC = () => {

  return (
    <div>
      <UserBanner />
      <ListPhone/>
      <GetRecommendation />
      <UserFeature />
      <UserArrivale />
    </div>
  );
};

export default UserHome;
