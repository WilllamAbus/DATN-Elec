import React from 'react';

import UserDetails from '../../../components/User/feature/details/detalsListting/detailPage'
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify";
const ProductDetail:  React.FC = () => {


    return (
        <> 

        <UserDetails/>
        <ToastContainer />

        </>
    );
};

export default ProductDetail;
