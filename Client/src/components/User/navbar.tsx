// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import dropOneNav from "../../assets/images/icons/3d-printer-tool.svg";
// import dropTwoNav from "../../assets/images/icons/charge-nitendo-power-switch-svgrepo-com.svg";
// import dropThreeNav from "../../assets/images/icons/digital-camera-photograph-svgrepo-com.svg";
// import dropFourNav from "../../assets/images/icons/drone-quadcopter-top-svgrepo-com.svg";
// import dropFiveNav from "../../assets/images/icons/gpu-svgrepo-com.svg";
// import dropSixNav from "../../assets/images/icons/play-station-logo-svgrepo-com.svg";
// const Navbar: React.FC = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [name, setName] = useState<string | null>(null);
//   const [roles, setRole] = useState<{ name: string } | null>(null);
//   useEffect(() => {
//     // Lấy token và name từ localStorage
//     const storedToken = localStorage.getItem("token");
//     const storedName = localStorage.getItem("name");
//     const storedRole = localStorage.getItem("roles");

//     if (storedToken) {
//       setToken(storedToken);
//     }

//     // Nếu lưu trữ name dưới dạng chuỗi đơn giản
//     if (storedName) {
//       setName(storedName); // Không cần JSON.parse
//     }
//     if (storedRole) {
//       try {
//         const parsedRole = JSON.parse(storedRole);
//         setRole(parsedRole);
//       } catch (error) {
//         console.error("Lỗi phân tích JSON:", error);
//       }
//     }
//   }, []);

//   return (
//     <nav className="bg-gray-800">
//       <div className="container flex">
//         <div className="px-8 py-4 bg-primary flex items-center cursor-pointer relative group">
//           <span className="text-white">
//             <i className="fa-solid fa-bars"></i>
//           </span>
//           <span className="capitalize ml-2 text-white">Danh mục</span>

//           {/* dropdown */}
//           <div className="absolute w-full left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
//             <a
//               href="#"
//               className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//             >
//               <img
//                 src={dropOneNav}
//                 alt="sofa"
//                 className="w-5 h-5 object-contain"
//               />
//               <span className="ml-6 text-gray-600 text-sm">Máy in 3D</span>
//             </a>
//             <a
//               href="#"
//               className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//             >
//               <img
//                 src={dropFiveNav}
//                 alt="terrace"
//                 className="w-5 h-5 object-contain"
//               />
//               <span className="ml-6 text-gray-600 text-sm">Card đồ họa</span>
//             </a>
//             <a
//               href="#"
//               className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//             >
//               <img
//                 src={dropFourNav}
//                 alt="bed"
//                 className="w-5 h-5 object-contain"
//               />
//               <span className="ml-6 text-gray-600 text-sm">Drone</span>
//             </a>
//             <a
//               href="#"
//               className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//             >
//               <img
//                 src={dropSixNav}
//                 alt="office"
//                 className="w-5 h-5 object-contain"
//               />
//               <span className="ml-6 text-gray-600 text-sm">Game </span>
//             </a>
//             <a
//               href="#"
//               className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//             >
//               <img
//                 src={dropThreeNav}
//                 alt="outdoor"
//                 className="w-5 h-5 object-contain"
//               />
//               <span className="ml-6 text-gray-600 text-sm">
//                 Máy ảnh kĩ thuật số
//               </span>
//             </a>
//             <a
//               href="#"
//               className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//             >
//               <img
//                 src={dropTwoNav}
//                 alt="Mattress"
//                 className="w-5 h-5 object-contain"
//               />
//               <span className="ml-6 text-gray-600 text-sm">Nintendo</span>
//             </a>
//           </div>
//         </div>

//         <div className="flex items-center justify-between flex-grow pl-12">
//           <div className="flex items-center space-x-6 capitalize">
//             <a href="/" className="text-gray-200 hover:text-white transition">
//               Trang chủ
//             </a>
//             <Link
//               to="/allList"
//               className="text-gray-200 hover:text-white transition"
//             >
//               Mua sắm
//             </Link>
//             <a href="#" className="text-gray-200 hover:text-white transition">
//               Dịch vụ
//             </a>
//             <a href="#" className="text-gray-200 hover:text-white transition">
//               Liên hệ
//             </a>
//           </div>

//           <div></div>
//           <div className="px-8 py-4 flex items-center cursor-pointer relative group">
//             <span className="text-white">
//               <i className="fa-solid fa-user"></i>
//             </span>
//             <div className="relative">
//               {token && name ? (
//                 // Hiển thị thông tin người dùng nếu đã đăng nhập
//                 <div className="flex items-center">
//                   <div className="relative group">
//                     <span className="ml-6 text-gray-600 text-lg">{name}</span>
//                     {/* dropdown */}
//                     <div className="absolute w-full left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
//                       <Link
//                         to="/profile"
//                         className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//                       >
//                         <img
//                           alt="Avatar"
//                           className="w-10 h-10 object-cover rounded-full"
//                         />
//                         <span className="ml-6 text-gray-600 text-lg">
//                           Profile
//                         </span>
//                       </Link>
//                       {roles?.name === "admin" && (
//                         <Link
//                           to="/admin/dashboard"
//                           className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//                         >
//                           <img
//                             alt="Admin"
//                             className="w-10 h-10 object-cover rounded-full"
//                           />
//                           <span className="ml-6 text-gray-600 text-lg">
//                             Admin
//                           </span>
//                         </Link>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // Hiển thị đăng nhập và đăng ký nếu chưa đăng nhập
//                 <div>
//                   <Link to="/login" className="capitalize ml-2 text-white">
//                     Đăng nhập |
//                   </Link>
//                   <Link to="/register" className="capitalize ml-2 text-white">
//                     Đăng ký
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* <Link
//             to="/login"
//             className="text-gray-200 hover:text-white transition
//                      cursor-pointer relative group"
//           >
//               Đăng nhập/Đăng ký

//             <div
//               className="absolute
//                      w-full left-0
//                      top-full bg-white
//                       shadow-md py-3
//                        divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100
//                        transition duration-300 invisible group-hover:visible"
//             >
//               <Link
//                 to="/admin/dashboard"
//                 className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
//               >
//                 <span className="ml-6 text-gray-600 text-sm">Admin</span>
//               </Link>
//             </div>
//           </Link> */}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dropOneNav from "../../assets/images/icons/3d-printer-tool.svg";
import dropTwoNav from "../../assets/images/icons/charge-nitendo-power-switch-svgrepo-com.svg";
import dropThreeNav from "../../assets/images/icons/digital-camera-photograph-svgrepo-com.svg";
import dropFourNav from "../../assets/images/icons/drone-quadcopter-top-svgrepo-com.svg";
import dropFiveNav from "../../assets/images/icons/gpu-svgrepo-com.svg";
import dropSixNav from "../../assets/images/icons/play-station-logo-svgrepo-com.svg";

const Navbar: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [roles, setRole] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("roles");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedName) {
      setName(storedName);
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("roles");
    setToken(null);
    setName(null);
    setRole(null);
  };

  return (
    <nav className="bg-gray-800">
      <div className="container flex">
        <div className="px-8 py-4 bg-primary flex items-center cursor-pointer relative group">
          <span className="text-white">
            <i className="fa-solid fa-bars"></i>
          </span>
          <span className="capitalize ml-2 text-white">Danh mục</span>

          <div className="absolute w-full left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
            >
              <img
                src={dropOneNav}
                alt="Máy in 3D"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-6 text-gray-600 text-sm">Máy in 3D</span>
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
            >
              <img
                src={dropFiveNav}
                alt="Card đồ họa"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-6 text-gray-600 text-sm">Card đồ họa</span>
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
            >
              <img
                src={dropFourNav}
                alt="Drone"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-6 text-gray-600 text-sm">Drone</span>
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
            >
              <img
                src={dropSixNav}
                alt="Game"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-6 text-gray-600 text-sm">Game</span>
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
            >
              <img
                src={dropThreeNav}
                alt="Máy ảnh kĩ thuật số"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-6 text-gray-600 text-sm">
                Máy ảnh kĩ thuật số
              </span>
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
            >
              <img
                src={dropTwoNav}
                alt="Nintendo"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-6 text-gray-600 text-sm">Nintendo</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between flex-grow pl-12">
          <div className="flex items-center space-x-6 capitalize">
            <a href="/" className="text-gray-200 hover:text-white transition">
              Trang chủ
            </a>
            <Link
              to="/allList"
              className="text-gray-200 hover:text-white transition"
            >
              Mua sắm
            </Link>
            <a href="#" className="text-gray-200 hover:text-white transition">
              Dịch vụ
            </a>
            <a href="#" className="text-gray-200 hover:text-white transition">
              Liên hệ
            </a>
          </div>

          <div></div>
          <div className="px-8 py-4 flex items-center cursor-pointer relative group">
            <span className="text-white">
              <i className="fa-solid fa-user"></i>
            </span>
            <div className="relative">
              {token && name ? (
                <div className="flex items-center">
                  <div className="relative group">
                    <span className="ml-6 text-white text-lg">{name}</span>
                    {/* dropdown */}
                    <div className="absolute w-full left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
                      <Link
                        to="/profile"
                        className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
                      >
                        <img
                          alt="Avatar"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                        <span className="ml-6 text-gray-600 text-lg">
                          Profile
                        </span>
                      </Link>
                      {roles === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
                        >
                          <img
                            alt="Admin"
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <span className="ml-6 text-gray-600 text-lg">
                            Admin
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
                      >
                        <span className="ml-6 text-gray-600 text-lg">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Link to="/login" className="capitalize ml-2 text-white">
                    Đăng nhập |
                  </Link>
                  <Link to="/register" className="capitalize ml-2 text-white">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
