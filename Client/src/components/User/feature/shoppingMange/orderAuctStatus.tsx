import React, { useState } from "react";

import ListOrders from "./orderStatusAuc/allListOrderAuc";

import ShippingOrders from "./orderStatusAuc/ShippingStatusOrders";
import ReceiveOrders from "./orderStatusAuc/ReciveStatusOrder";
import CompletedOrders from "./orderStatusAuc/CompleteStatusOrder";
import PendingOrders from "./orderStatusAuc/pendingOrderAuc"
import Confirmed from "./orderStatusAuc/confirmedOrderAuc"
const Order: React.FC = () => {
  const [view, setView] = useState<
    | "list"

    | "pending"
    | "confirmed"
  
    | "shipping"
    | "recieve"
    | "completed"
   
  >("list");

  return (
    <div className="py-5 relative">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className=" text-3xl leading-10 text-black mb-9">Đơn hàng đấu giá</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <ul className="flex flex-wrap sm:flex-nowrap gap-x-5 gap-y-3 sm:gap-y-0">
            <li
              onClick={() => setView("list")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "list" ? "text-primary" : "text-gray-600"
              }`}
            >
              Tất cả đơn hàng
            </li>
            <li
              onClick={() => setView("pending")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "list" ? "text-primary" : "text-gray-600"
              }`}
            >
              Chờ xử lý
            </li>
            <li
              onClick={() => setView("confirmed")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "list" ? "text-primary" : "text-gray-600"
              }`}
            >
              Đã xác nhận
            </li>
            <li
              onClick={() => setView("shipping")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "shipping" ? "text-primary" : "text-gray-600"
              }`}
            >
              Đang vận chuyển
            </li>
            <li
              onClick={() => setView("recieve")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "recieve" ? "text-primary" : "text-gray-600"
              }`}
            >
              Nhận hàng
            </li>
            <li
              onClick={() => setView("completed")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "completed" ? "text-primary" : "text-gray-600"
              }`}
            >
              Đơn hàng đã hoàn tất
            </li>
        
          </ul>
        </div>
  
  
        {view === "list" && <ListOrders />}

        {view === "pending" && <PendingOrders />}
        {view === "confirmed" && <Confirmed />}

        {view === "shipping" && <ShippingOrders />}
        {view === "recieve" && < ReceiveOrders/>}
        {view === "completed" && <CompletedOrders />}
     
        {/* {view === "detail" && selectedOrder && (
          <DetailOrder order={selectedOrder} onBack={handleBackToList} />
        )} */}

        {/* {view === "watchlist" && <Watchlist profiles={profile} />} */}
      </div>
    </div>
  );
};

export default Order;
