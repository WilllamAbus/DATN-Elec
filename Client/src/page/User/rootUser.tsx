import React from 'react';
import UserArrivale from '../../components/User/arrivale'
import UserBanner from '../../components/User/banner'
import UserCategories from '../../components/User/categories'
import UserFooter from '../../components/User/footer'
import UserHeader from '../../components/User/header'
import UserCoppyright from '../../components/User/copyright'
import UserFeature from '../../components/User/feeture'
import UserHeadTag from '../../components/User/headTag'
import UserNav from '../../components/User/navbar'
import UserProdSection from '../../components/User/productSection'
import '../../assets/css/user.style.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

const User: React.FC = () => {
    return (
      <>
    <UserHeadTag/>
    <div className='userContent'>
        <UserHeader/>
        <UserNav/>
        <UserBanner/>
        <UserFeature/>
        <UserCategories/>
        <UserArrivale/>
        <UserProdSection/>
        <UserFooter/>
        <UserCoppyright/>
    </div>
      
      </>
  
    );
};

export default User;
