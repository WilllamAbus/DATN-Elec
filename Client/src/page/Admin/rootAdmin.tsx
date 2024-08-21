import React, { useEffect, useState } from "react";
import AdminFooter from "../../components/Admin/footer";
import AdminHeader from "../../components/Admin/header";
import AdminSidebar from "../../components/Admin/sidebar";
import AdminStyleSheet from "../../components/Admin/stySheet";
import AdminContent from "../../components/Admin/mainContent";
import AdminScript from "../../components/Admin/script";
import "../../assets/css/admin.style.css";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../redux/store";
import { getProfileThunk } from "../../redux/auth/authThunk";
import { useDispatch, useSelector } from "react-redux";

const Admin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
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

  return (
    <>
      <AdminStyleSheet />
      <div className="bg-gray-100 font-family-karla flex">
        <AdminSidebar />
        <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
          <AdminHeader />
          <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
            <AdminContent />
            <AdminFooter />
          </div>
        </div>
        <AdminScript />
      </div>
    </>
  );
};

export default Admin;
