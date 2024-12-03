import React from 'react';

import UserPageDetail from '../../../../components/User/feature/details/detalsListting/detailPage'
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify";
const ProductDetail:  React.FC = () => {


    return (
        <> 
        <UserPageDetail/>
        <ToastContainer />
        </>
    );
};

export default ProductDetail;
