import React from "react";
import { RouteObject } from "react-router-dom";
import User from "../page/User/Home/home";
const UserHome = React.lazy(() => import("../page/User/rootUser"));
const ExternalPage = React.lazy(() => import("../page/User/externalpage"));
const UserLogin = React.lazy(() => import("../page/User/accounts/login"));
const UserRegister = React.lazy(() => import("../page/User/accounts/register"));
const UserRegisOTP = React.lazy(() => import("../page/User/accounts/regisOTP"));
const UserVerifyOTP = React.lazy(
  () => import("../page/User/accounts/verifyOtp")
);
const UserRecievePass = React.lazy(
  () => import("../page/User/accounts/recivePass")
);
const UserForgotPass = React.lazy(() => import("../page/User/accounts/forgot"));
const UserLoginSuccess = React.lazy(
  () => import("../page/User/accounts/login-success")
);
const UserReciveCode = React.lazy(
  () => import("../page/User/accounts/reciveCode")
);
const VerifyEmail = React.lazy(
  () => import("../page/User/accounts/VerifyEmail")
);
const ResetPassword = React.lazy(
  () => import("../page/User/accounts/ResetPassword")
);
const UserAllList = React.lazy(
  () => import("../page/User/shopping/gallery/allListing")
);
const UserMyList = React.lazy(
  () => import("../page/User/shopping/gallery/listTing")
);
const UserListPage = React.lazy(
  () => import("../page/User/shopping/listPage/listPage")
);
const UserAuction = React.lazy(
  () => import("../page/User/shopping/gallery/auction")
);
const UserdetailsProd = React.lazy(
  () => import("../page/User/shopping/details/detail")
);
const UserPageDetail = React.lazy(
  () => import("../page/User/shopping/detailV2/detail")
);
const UserdetailsAuc = React.lazy(
  () => import("../page/User/shopping/auction/auctionDetails")
);
const UserCartPage = React.lazy(
  () => import("../page/User/shopping/cart/cartPage")
);
const UserCheckoutpage = React.lazy(
  () => import("../page/User/shopping/cart/paymentPage")
);
const UserPaymentpage = React.lazy(
  () => import("../page/User/shopping/cart/complate")
);
const UserProdfile = React.lazy(
  () => import("../page/User/shoppingMange/profile")
);
const UserListCart = React.lazy(
  () => import("../page/User/shoppingMange/manageCart/list-Cart")
);
const UserWatchList = React.lazy(
  () => import("../page/User/watchList/watchList")
);
const UserSearch = React.lazy(
  () => import("../page/User/shopping/search/index")
);
const UserFilter = React.lazy(
  () => import("../page/User/shopping/filter/index")
);
const UserViewBids = React.lazy(
  () => import("../page/User/shopping/auction/biddings/viewBid")
);
const UserCheckoutAuctPages = React.lazy(
  () => import("../page/User/shopping/auction/biddings/checkoutAuctios")
);
const UserConfirmAucPage = React.lazy(
  () => import("../page/User/shopping/auction/biddings/completAuctions")
);

const UserConfirmAucDefaultPage = React.lazy(
  () => import("../page/User/shopping/auction/biddings/completAucDefault")
);
const LinkAccount = React.lazy(() => import("../page/User/accounts/link-account"));
const LinkAccountSuccess = React.lazy(() => import("../page/User/accounts/link-account-success")); 
const UserContact = React.lazy(() => import("../page/User/contact/contact"));
const UserRoutes: RouteObject[] = [
  {
    path: "/",
    element: <UserHome />,
    children: [
      { index: true, element: <User /> },
      { path: "login", element: <UserLogin /> },
      { path: "register", element: <UserRegister /> },
      { path: "verifyEmail", element: <VerifyEmail /> },
      { path: "regisOTP", element: <UserRegisOTP /> },
      { path: "verifyOTP", element: <UserVerifyOTP /> },
      { path: "forgot", element: <UserForgotPass /> },
      { path: "reset-password", element: <ResetPassword /> },
      {
        path: "login-success/:userId/:tokenLogin",
        element: <UserLoginSuccess />,
      },
      { path: "recivePass", element: <UserRecievePass /> },
      { path: "reciveCode", element: <UserReciveCode /> },
      { path: "allList", element: <UserAllList /> },
      { path: "listTing", element: <UserMyList /> },
      { path: "category/:slug", element: <UserListPage /> },
      { path: "auction", element: <UserAuction /> },
      { path: "product/:slug", element: <UserPageDetail /> },
      { path: "detailProd/:id", element: <UserdetailsProd /> },
      { path: "detailAuc/:productId", element: <UserdetailsAuc /> },
      { path: "cart", element: <UserCartPage /> },
      { path: "search/:keyword", element: <UserSearch /> },
      { path: "filter/:price", element: <UserFilter /> },
      { path: "checkout/:id", element: <UserCheckoutpage /> },
      { path: "complete/:id", element: <UserPaymentpage /> },
      { path: "profile", element: <UserProdfile /> },
      { path: "listCart", element: <UserListCart /> },
      { path: "watchList", element: <UserWatchList /> },
      { path: "viewBids", element: <UserViewBids /> },
      { path: "checkoutAuc", element: <UserCheckoutAuctPages /> },
      { path: "confimAuc", element: <UserConfirmAucPage /> },
      { path: "confimAucDefault", element: <UserConfirmAucDefaultPage /> },
      { path: "contact", element: <UserContact /> },
    ],
  },
  {
    path: "/",
    element: <ExternalPage />,
    children: [
      { path: "link-account", element: <LinkAccount /> },
      { path: "link-account-success", element: <LinkAccountSuccess /> }

    ],
  },
  {
    path: "*",
    element: <UserHome />,
  },
];

export default UserRoutes;
