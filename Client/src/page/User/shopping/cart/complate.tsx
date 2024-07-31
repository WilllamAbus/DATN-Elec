import React from "react";

import UserHeader from "../../../../components/User/header";
import UserNav from "../../../../components/User/navbar";
import UserFooter from "../../../../components/User/footer";
import UserCoppyright from "../../../../components/User/copyright";

import UserCartComplete from "../../../../components/User/feature/cart/complete"
import "../../../../assets/css/user.style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
const completePage: React.FC = () => {
  return (
    <>
      <UserHeader />
      <UserNav />
    <UserCartComplete/>
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default completePage;
