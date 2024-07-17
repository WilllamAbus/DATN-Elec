import React from 'react';
import deleveryIcon from "../../assets/images/icons/delivery-van.svg"
import moneyBack from "../../assets/images/icons/money-back.svg"
import serViceHour from "../../assets/images/icons/service-hours.svg"
const Features:React.FC = () => {
    return (
        <div className="container py-16">
            <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
                <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                    <img src={deleveryIcon} alt="Delivery" className="w-12 h-12 object-contain" />
                    <div>
                        <h4 className="font-medium capitalize text-lg">Miễn phí vận chuyển</h4>
                        <p className="text-gray-500 text-sm">Hóa đơn trên 400.000 vnđ</p>
                    </div>
                </div>
                <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                    <img src={moneyBack} alt="Delivery" className="w-12 h-12 object-contain" />
                    <div>
                        <h4 className="font-medium capitalize text-lg">Hoàn tiền</h4>
                        <p className="text-gray-500 text-sm">Hoàn trả trong 30 ngày</p>
                    </div>
                </div>
                <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                    <img src={serViceHour} alt="Delivery" className="w-12 h-12 object-contain" />
                    <div>
                        <h4 className="font-medium capitalize text-lg">24/7 Hỗ trợ</h4>
                        <p className="text-gray-500 text-sm">Hỗ trợ khách hàng</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
