import React  from "react";
// import { Link } from 'react-router-dom';
import UserHeader from "../../../../components/User/header";
import UserNav from "../../../../components/User/navbar";
import UserFooter from "../../../../components/User/footer";
import UserCoppyright from "../../../../components/User/copyright";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UserSearch from "../../../../components/User/feature/search/index";

const allListing: React.FC = () => {
 
  return (
    <>
      <UserHeader />
      <UserNav />
      <UserSearch/>

   
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default allListing;
