// src/routes/UserRoutes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';

const UserHome = React.lazy(() => import('../page/User/rootUser'));
const UserLogin = React.lazy(() => import('../page/User/accounts/login'));
const UserRegister =  React.lazy(() => import('../page/User/accounts/register'));
const UserRegisOTP =  React.lazy(() => import('../page/User/accounts/regisOTP'));
const UserRecievePass = React.lazy(() => import('../page/User/accounts/recivePass'));
const UserForgotPass = React.lazy(() => import('../page/User/accounts/forgot'));
const UserLoginSuccess = React.lazy(() => import('../page/User/accounts/login-success'));
const UserReciveCode =   React.lazy(() => import('../page/User/accounts/reciveCode'));

const UserAllList =  React.lazy(() => import('../page/User/shopping/gallery/allListing'));
const UserMyList =  React.lazy(() => import('../page/User/shopping/gallery/listTing'));
const UserAuction =  React.lazy(() => import('../page/User/shopping/gallery/auction'));
const UserdetailsProd =  React.lazy(() => import('../page/User/shopping/details/detail'));
const UserdetailsAuc =  React.lazy(() => import('../page/User/shopping/auction/auctionDetails'));
const UserCartPage =  React.lazy(() => import('../page/User/shopping/cart/cartPage'));
const UserCheckoutpage = React.lazy(() => import('../page/User/shopping/cart/paymentPage'));
const UserPaymentpage = React.lazy(() => import('../page/User/shopping/cart/complate'));
const UserProdfile = React.lazy(() => import('../page/User/shoppingMange/profile'));
const UserWatchList =   React.lazy(() => import('../page/User/watchList/watchList'));

const UserRoutes: RouteObject[] = [
  {
    path: '/',
    element: <UserHome />,
  },
  /***Accounts Router */
  {
    path: 'login',
    element: <UserLogin/>,
  },
  {
    path: 'register',
    element: <UserRegister/>,
  },
  {
    path: 'regisOTP',
    element: <UserRegisOTP/>,
  },
  {
    path: 'forgot',
    element: <UserForgotPass/>,
  },
  {
    path: 'login-success/:userId/:tokenLogin',
    element: <UserLoginSuccess/>,
  },
  {
    path: 'recivePass',
    element: <UserRecievePass/>,
  },
  {
    path: 'reciveCode',
    element: <UserReciveCode/>,
  },

  /**Shopping router */

  {
    path: 'allList',
    element: <UserAllList/>,
  },
  {
    path: 'listTing',
    element: <UserMyList/>,
  },
  {
    path: 'auction',
    element: <UserAuction />,
  },
  {
    path: 'detailProd',
    element: <UserdetailsProd/>,
  },
  {
    path: 'detailAuc',
    element: <UserdetailsAuc/>,
  },
  {
    path: 'cart',
    element: <UserCartPage/>,
  },
  {
    path: 'checkout',
    element: <UserCheckoutpage/>,
  },
  {
    path: 'complete',
    element: <UserPaymentpage/>,
  },

  /***Profile */
  {
    path: 'profile',
    element: <UserProdfile/>,
  },
  {
    path: 'watchList',
    element: <UserWatchList/>,
  },
  {
    path: '*',
    element: <UserHome />,
  },
];

// const UserRoutesWrapper: React.FC = () => (
//   <div>
//      <Outlet />
//   </div>
 
// );

export default UserRoutes ;

