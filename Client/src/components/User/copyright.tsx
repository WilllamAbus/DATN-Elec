import React from 'react';
import methods from "../../assets/images/methods.png"
const Copyright: React.FC = () => {
    return (
        <div className="bg-gray-800 py-4">
            <div className="container flex items-center justify-between">
                <p className="text-white">&copy; 2024 - All Right Reserved</p>
                <div>
                    <img src={methods} alt="methods" className="h-5" />
                </div>
            </div>
        </div>
    );
};

export default Copyright;
