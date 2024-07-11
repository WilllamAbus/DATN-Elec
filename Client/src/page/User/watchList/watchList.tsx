import React from "react";
import { Link } from 'react-router-dom'; 
import UserHeader from "../../../components/User/header";
import UserNav from "../../../components/User/navbar";
import UserFooter from "../../../components/User/footer";
import UserCoppyright from "../../../components/User/copyright";
import Avatar  from '../../../assets/images/avatar.png'
import "../../../assets/css/user.style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
const watchList: React.FC = () => {
  return (
    <>
      <UserHeader />
      <UserNav />
      {/* Breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <Link  to=""  className="text-primary text-base">
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
        <div className="col-span-3">
          <div className="px-4 py-3 shadow flex items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={Avatar}
                alt="profile"
                className="rounded-full w-14 h-14 border border-gray-200 p-1 object-cover"
              />
            </div>
            <div className="flex-grow">
            <p className="text-gray-600">Hello,</p>
            <h4 className="text-gray-800 font-medium">Email</h4>
            </div>
          </div>
          <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
          <div className="space-y-1 pl-8">
            <a
              href="#"
              className="relative text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-regular fa-address-card"></i>
              </span>
              Manage account
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              Profile information
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              Manage addresses
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              Change password
            </a>
          </div>

          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-solid fa-box-archive"></i>
              </span>
              My order history
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              My returns
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              My Cancellations
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              My reviews
            </a>
          </div>

          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-regular fa-credit-card"></i>
              </span>
              Payment methods
            </a>
            <a
              href="#"
              className="relative hover:text-primary block capitalize transition"
            >
              Voucher
            </a>
          </div>

          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-regular fa-heart"></i>
              </span>
              My wishlist
            </a>
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-regular fa-heart"></i>
              </span>
              Message
            </a>
          </div>

          <div className="space-y-1 pl-8 pt-4">
            <a
              href="#"
              className="relative hover:text-primary block font-medium capitalize transition"
            >
              <span className="absolute -left-8 top-0 text-base">
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
              Logout
            </a>
          </div>
        </div>
        </div>
       
        {/* ./sidebar */}

        {/* Info */}
        <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                    <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          #
                        </th>
                        <th scope="col" className="px-6 py-4">
                          First
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Last
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Handle
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-200 dark:border-white/10">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          1
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">Mark</td>
                        <td className="whitespace-nowrap px-6 py-4">Otto</td>
                        <td className="whitespace-nowrap px-6 py-4">@mdo</td>
                      </tr>
                      <tr className="border-b border-neutral-200 dark:border-white/10">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">Jacob</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          Thornton
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">@fat</td>
                      </tr>
                      <tr className="border-b border-neutral-200 dark:border-white/10">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          3
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">Larry</td>
                        <td className="whitespace-nowrap px-6 py-4">Wild</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          @twitter
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ./info */}
      </div>
      {/* ./wrapper */}
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default watchList;
