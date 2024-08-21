import React from "react";
import { Outlet } from "react-router-dom";
import { UserFooter } from "../../components/User/footer";
import UserHeader from "../../components/User/header";
import UserNav from "../../components/User/navbar";

const User: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <UserHeader />
      <UserNav />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div
          id="main-content"
          className="relative w-full max-w-screen-2xl mx-auto h-full overflow-y-auto bg-gray-50 dark:bg-gray-900"
        >
          <main>
            <div className="px-4 pt-6 2xl:px-0">
              <Outlet />
            </div>
          </main>
          <UserFooter />
        </div>
      </div>
    </div>
  );
};
export default User;
