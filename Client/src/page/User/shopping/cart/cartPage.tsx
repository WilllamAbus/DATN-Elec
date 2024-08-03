import React from "react";

import UserHeader from "../../../../components/User/header";
import UserNav from "../../../../components/User/navbar";
import UserFooter from "../../../../components/User/footer";
import UserCoppyright from "../../../../components/User/copyright";
import UserCartPage from "../../../../components/User/feature/cart/cartPage"
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const cartPage: React.FC = () => {
  return (
    <>
      <UserHeader />
      <UserNav />
     <UserCartPage/>

 
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default cartPage;
