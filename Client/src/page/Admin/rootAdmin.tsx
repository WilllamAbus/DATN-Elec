// import React, { useEffect } from "react";
// import AdminFooter from "../../components/Admin/footer";
// import AdminHeader from "../../components/Admin/header";
// import AdminSidebar from "../../components/Admin/sidebar";
// import AdminStyleSheet from "../../components/Admin/stySheet";
// import AdminContent from "../../components/Admin/mainContent";
// import AdminScript from "../../components/Admin/script";
// import "../../assets/css/admin.style.css";
// import { Outlet, Navigate } from "react-router-dom";
// import { getProfile } from "../../services/authentication/demo.services";
// import { useCookies } from "react-cookie";
// const Admin: React.FC = () => {
//   const [cookies, setCookie] = useCookies(["token", "roles"]);
//   useEffect(() => {
//     console.log("cookie === ", cookies);
//     getUserInfo();
//   }, []);
//   const getUserInfo = async () => {
//     const res = await getProfile();
//     if (res?.roles != cookies?.roles) {
//       const dateExpired = new Date();
//       dateExpired.setHours(dateExpired.getHours() + 1);
//       setCookie("roles", res?.roles, { path: "/", expires: dateExpired });
//     }
//   };
//   return cookies?.token && cookies?.roles == "admin" ? (
//     <>
//       <AdminStyleSheet />

//       <div className="bg-gray-100 font-family-karla flex">
//         <AdminSidebar />
//         <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
//           <AdminHeader />
//           <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
//             <AdminContent />
//             <AdminFooter />
//           </div>
//         </div>
//         <AdminScript />
//       </div>
//     </>
//   ) : (
//     <Navigate to={"/login"} />
//   );
// };

// export default Admin;
import React, { useEffect } from "react";
import AdminFooter from "../../components/Admin/footer";
import AdminHeader from "../../components/Admin/header";
import AdminSidebar from "../../components/Admin/sidebar";
import AdminStyleSheet from "../../components/Admin/stySheet";
import AdminContent from "../../components/Admin/mainContent";
import AdminScript from "../../components/Admin/script";
import "../../assets/css/admin.style.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/rootReducer";

import { getProfile } from "../../services/authentication/auth.services";

const Admin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const profile = useAppSelector((state) => state.auth.profile.profile);
  const profileStatus = useAppSelector((state) => state.auth.profile.status);
  const profileError = useAppSelector((state) => state.auth.profile.error);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(getProfile() as any);

        const storedRole = localStorage.getItem("roles") ?? "";
        if (profile?.roles[0] !== storedRole) {
          const dateExpired = new Date();
          dateExpired.setHours(dateExpired.getHours() + 1);
          localStorage.setItem("roles", profile?.roles[0] ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (localStorage.getItem("token")) {
      fetchProfile();
    }
  }, [dispatch, profile, navigate]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("roles") ?? "";

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "admin" || profileStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (profileStatus === "failed") {
    return <p>Error: {profileError}</p>;
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
