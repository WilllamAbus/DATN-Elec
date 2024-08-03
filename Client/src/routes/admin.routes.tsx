// src/routes/AdminRoutes.tsx
import React from "react";
import { RouteObject } from "react-router-dom";

const Dashboard = React.lazy(() => import("../page/Admin/rootAdmin"));
/**Categoris */
const AdminAddCategories = React.lazy(
  () => import("../page/Admin/categories/addCategories")
);
const AdminEditCategories = React.lazy(
  () => import("../page/Admin/categories/editCategories")
);
const AdminListCategories = React.lazy(
  () => import("../page/Admin/categories/listCategories")
);
/**Products */
const AdminAddProducts = React.lazy(
  () => import("../page/Admin/products/addProd")
);
const AdminEditProducts = React.lazy(
  () => import("../page/Admin/products/editProd")
);
const AdminListProducts = React.lazy(
  () => import("../page/Admin/products/listProd")
);
/**Brands */
const AdminAddBrands = React.lazy(
  () => import("../page/Admin/brands/addBrands")
);
const AdminEditBrands = React.lazy(
  () => import("../page/Admin/brands/editBrands")
);
const AdminListBrands = React.lazy(
  () => import("../page/Admin/brands/listBrands")
);
/**BuyingFormat */
const AdminAddBuyingFormat = React.lazy(
  () => import("../page/Admin/buyingFormat/addBuyFormat")
);
const AdminEditBuyingFormat = React.lazy(
  () => import("../page/Admin/buyingFormat/editBuyFormat")
);
const AdminListBuyingFormat = React.lazy(
  () => import("../page/Admin/buyingFormat/listBuyFormat")
);
/**Comments */
const AdminListComments = React.lazy(
  () => import("../page/Admin/comments/listComments")
);

/**ConditionAuc */

const AdminConditionAuc = React.lazy(
  () => import("../page/Admin/conditionAuction/addConditionAuction")
);
const AdminEditConditionAuc = React.lazy(
  () => import("../page/Admin/conditionAuction/editCodAuc")
);
const AdminListCondAuc = React.lazy(
  () => import("../page/Admin/conditionAuction/listCondAuc")
);

/**CustomerService */
const AdminListCService = React.lazy(
  () => import("../page/Admin/customerService/listCService")
);

/**discounts */
const AdminAddVoucher = React.lazy(
  () => import("../page/Admin/vouchers/addVoucher")
);
const AdminEditVoucher = React.lazy(
  () => import("../page/Admin/vouchers/editVoucher")
);
const AdminListVoucher = React.lazy(
  () => import("../page/Admin/vouchers/listVoucher")
);
/**Orders */

const AdminListOrder = React.lazy(
  () => import("../page/Admin/orders/listOrder")
);
const AdminDetailsOrder = React.lazy(
  () => import("../page/Admin/orders/detailsOrder")
);

/**productionAuc */
const AdminAddProdAuc = React.lazy(
  () => import("../page/Admin/productAuction/addProdAuc")
);
const AdminEditProdAuc = React.lazy(
  () => import("../page/Admin/productAuction/editProdAuc")
);
const AdminListProdAuc = React.lazy(
  () => import("../page/Admin/productAuction/listProdAuc")
);
/***RecycleBin */

const AdminRecycleBinCate = React.lazy(
  () => import("../page/Admin/recycleBinCate/allItemList")
);
const AdminRecycleBin = React.lazy(
  () => import("../page/Admin/recycleBin/SoftDeletedProduct")
);

/**User */
const AdminListUser = React.lazy(() => import("../page/Admin/users/listUser"));

const AdminRoutes: RouteObject[] = [
  {
    path: "",
    element: <Dashboard />,
  },
  // categories module
  {
    path: "addCategories",
    element: <AdminAddCategories />,
  },
  {
    path: "editCategories/:id",
    element: <AdminEditCategories />,
  },
  {
    path: "listCategories",
    element: <AdminListCategories />,
  },

  /*****Products */
  {
    path: "addProducts",
    element: <AdminAddProducts />,
  },
  {
    path: "editProducts/:id",
    element: <AdminEditProducts />,
  },
  {
    path: "listProducts",
    element: <AdminListProducts />,
  },

  /*****Brands */
  {
    path: "addBrands",
    element: <AdminAddBrands />,
  },
  {
    path: "editBrands",
    element: <AdminEditBrands />,
  },
  {
    path: "listBrands",
    element: <AdminListBrands />,
  },

  /*****Buying Format */
  {
    path: "addBuyingFormat",
    element: <AdminAddBuyingFormat />,
  },
  {
    path: "editBuyingFormat",
    element: <AdminEditBuyingFormat />,
  },
  {
    path: "listBuyingFormat",
    element: <AdminListBuyingFormat />,
  },

  /*******Comment-rating */
  {
    path: "listComments",
    element: <AdminListComments />,
  },

  /***Condition */
  {
    path: "addConditon",
    element: <AdminConditionAuc />,
  },
  {
    path: "editCondition",
    element: <AdminEditConditionAuc />,
  },
  {
    path: "listCondition",
    element: <AdminListCondAuc />,
  },

  /**CustomerService */
  {
    path: "listCusSer",
    element: <AdminListCService />,
  },
  /**discounts */

  /**discounts */
  {
    path: "addVouchers",
    element: <AdminAddVoucher />,
  },
  {
    path: "editVouchers/:id",
    element: <AdminEditVoucher />,
  },
  {
    path: "listVouchers",
    element: <AdminListVoucher />,
  },

  /**Orders */
  {
    path: "listOrders",
    element: <AdminListOrder />,
  },
  {
    path: "listDetailOrder",
    element: <AdminDetailsOrder />,
  },

  /**productionAuc */
  {
    path: "addProdAuc",
    element: <AdminAddProdAuc />,
  },
  {
    path: "editProdAuc",
    element: <AdminEditProdAuc />,
  },
  {
    path: "listProdAuc",
    element: <AdminListProdAuc />,
  },

  /***RecycleBin */
  {
    path: "recycleBin",
    element: <AdminRecycleBin />,
  },
  {
    path: "recycleBinCate",
    element: <AdminRecycleBinCate />,
  },

  /*****User */
  {
    path: "listUser",
    element: <AdminListUser />,
  },
];

// const AdminRoutesWrapper: React.FC = () => (
//     <div>
//       <Outlet/>
//     </div>
// );

export default AdminRoutes;
