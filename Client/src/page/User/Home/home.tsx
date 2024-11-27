import React from "react";
import { UserBanner } from "../../../components/User/banner";
import UserFeature from "../../../components/User/feeture";
import UserCategories from "../../../components/User/categories";
import UserArrivale from "../../../components/User/arrivale";
// import UserProdSection from "../../../components/User/productSection";
import GetRecommendation from "../../../components/User/recommendation";

const UserHome: React.FC = () => {
  return (
    <div>
      <UserBanner />
      <UserCategories />
      {/* <UserProdSection /> */}
      <GetRecommendation />
      <UserFeature />
      <UserArrivale />
    </div>
  );
};

export default UserHome;
