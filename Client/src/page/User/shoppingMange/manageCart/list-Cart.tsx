import React from "react";
import UserHeader from "../../../../components/User/header";
import UserNav from "../../../../components/User/navbar";
import UserFooter from "../../../../components/User/footer";
import UserCoppyright from "../../../../components/User/copyright";
import { Link } from 'react-router-dom'; 
import UserSideBarProfile from '../../../../components/User/sidebarProfile/sidebar'
import UserListCart from "../../../../components/User/feature/manage/listCart"
import "../../../../assets/css/user.style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
const UserProfile: React.FC = () => {
  return (
    <>
      <UserHeader />
      <UserNav />
      {/* Breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <Link  to="/"  className="text-primary text-base">
          <i className="fa-solid fa-house"></i>
        </Link>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">HỒ SƠ KHÁCH HÀNG</p>
      </div>
      {/* ./breadcrumb */}

      {/* Wrapper */}
      <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">
        {/* Sidebar */}
        <UserSideBarProfile/>
   
        {/* ./sidebar */}

        {/* Info */}
       <UserListCart/>
        {/* ./info */}
      </div>
      {/* ./wrapper */}
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default UserProfile;