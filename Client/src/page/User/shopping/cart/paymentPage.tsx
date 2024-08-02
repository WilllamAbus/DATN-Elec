import React from "react";
import UserPayment from '../../../../components/User/feature/cart/payment'
import UserHeader from "../../../../components/User/header";
import UserNav from "../../../../components/User/navbar";
import UserFooter from "../../../../components/User/footer";
import UserCoppyright from "../../../../components/User/copyright";

import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
const cartPage: React.FC = () => {
  return (
    <>
      <UserHeader />
      <UserNav />
      <UserPayment/>
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default cartPage;
