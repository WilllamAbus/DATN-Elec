import React from "react";
import { UserBanner } from "../../../components/User/banner";
import UserFeature from "../../../components/User/feeture";
import UserCategories from "../../../components/User/categories";
import UserArrivale from "../../../components/User/arrivale";
import GetRecommendation from "../../../components/User/recommendation";

const UserHome: React.FC = () => {

  return (
    <div>
      <UserBanner />
      <UserCategories />
      <div className="text-center">
        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl uppercase py-10">
          Sản phẩm dành cho bạn
        </h2>
      </div>
      <GetRecommendation />
      <UserFeature />
      <UserArrivale />
    </div>
  );
};

export default UserHome;
