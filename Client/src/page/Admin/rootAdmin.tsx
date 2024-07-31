import React, { useEffect } from "react";
import AdminFooter from "../../components/Admin/footer";
import AdminHeader from "../../components/Admin/header";
import AdminSidebar from "../../components/Admin/sidebar";
import AdminStyleSheet from "../../components/Admin/stySheet";
import AdminContent from "../../components/Admin/mainContent";
import AdminScript from "../../components/Admin/script";
import "../../assets/css/admin.style.css";
import { Outlet, Navigate } from "react-router-dom";
import { getProfile } from "../../services/authentication/auth.services";
import { useCookies } from "react-cookie";
const Admin: React.FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "role"]);
  useEffect(() => {
    console.log("cookie === ", cookies);
    getUserInfo();
  }, [cookies]);
  const getUserInfo = async () => {
    const res = await getProfile();
    if (res?.roles != cookies?.role) {
      const dateExpired = new Date();
      dateExpired.setHours(dateExpired.getHours() + 1);
      setCookie("role", res?.roles, { path: "/", expires: dateExpired });
    }
  };
  return cookies?.token && cookies?.role == "admin" ? (
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
  ) : (
    <Navigate to={"/login"} />
  );
};

export default Admin;
