import React from 'react';
import UserHeader from '../../../../components/User/header';
import UserNav from '../../../../components/User/navbar';
import UserFooter from '../../../../components/User/footer';
import UserCoppyright from '../../../../components/User/copyright';
import '../../../../assets/css/user.style.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
// import Avatar  from '../../../../assets/images/avatar.png'
import UserDetails from '../../../../components/User/feature/details/detalsListting/detailListing'

const ProductDetail:  React.FC = () => {


    return (
        <>
         <UserHeader />
         <UserNav />
          
        <UserDetails/>
        

          
            <UserFooter />
            <UserCoppyright />
        </>
    );
};

export default ProductDetail;
