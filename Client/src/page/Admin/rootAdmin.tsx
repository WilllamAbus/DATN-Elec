import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/sidebar";
import AdminFooter from "../../components/Admin/footer";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

import { Outlet } from "react-router-dom";
import Nav from "../../components/Admin/nav";
import { useSelector } from "react-redux";

const Admin: React.FC = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

  const roles = useSelector((state: RootState) => state.auth.profile?.roles);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (roles) {
        if (roles.includes("admin")) {
          // User is admin, proceed with rendering the Admin component
        } else {
          console.log("User does not have admin role.");
          navigate("/", { replace: true });
        }
      } else {
        console.log("Roles are not available.");
        navigate("/", { replace: true });
      }
    }, 500); // Delay in milliseconds

    // Cleanup timeout if the component is unmounted before the timeout completes
    return () => clearTimeout(timer);
  }, [roles, navigate]);

  const handleSidebarClose = () => {
    setIsOpenSidebar(false);
  };
  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-800 font-barlow">
        <Nav />
        <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <AdminSidebar
            isOpenMobie={isOpenSidebar}
            onClose={handleSidebarClose}
          />
          <div
            className="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90"
            id="sidebarBackdrop"
          />
          <div
            id="main-content"
            className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
          >
            <main>
              <Outlet />
            </main>
            <AdminFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
