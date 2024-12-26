import React from "react";
import { Outlet } from "react-router-dom";


const User: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="flex overflow-hidden bg-white dark:bg-gray-900">
        <div
          id="main-content"
          className="relative w-full max-w-screen-2xl mx-auto h-full overflow-y-auto bg-white dark:bg-gray-900"
        >
          <main>
            <div className="2xl:px-0 ">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default User;
