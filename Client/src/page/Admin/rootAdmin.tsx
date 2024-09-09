import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/sidebar";
import AdminFooter from "../../components/Admin/footer";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../redux/store";
import { getProfileThunk } from "../../redux/auth/authThunk";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Nav from "../../components/Admin/nav";

const Admin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  useSelector((state: RootState) => state.auth.profile);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const resultAction = await dispatch(getProfileThunk());

      if (getProfileThunk.fulfilled.match(resultAction)) {
        const roles = resultAction.payload.roles;

        if (!Array.isArray(roles) || !roles.includes("admin")) {
          setIsAdmin(false);
          navigate("/login", { replace: true });
        }
      } else {
        console.error("Failed to fetch profile:", resultAction.payload);
        setIsAdmin(false);
        navigate("/login", { replace: true });
      }
    };

    fetchProfile();
  }, [dispatch, navigate]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  const handleSidebarClose = () => {
    setIsOpenSidebar(false);
  };
  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-800 font-barlow">
        <Nav />
        <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <AdminSidebar isOpenMobie={isOpenSidebar} onClose={handleSidebarClose} />
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
