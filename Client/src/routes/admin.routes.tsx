import "flowbite";
import React from "react";
import { RouteObject } from "react-router-dom";
import Admin from "../page/Admin/Home/home";
const Dashboard = React.lazy(() => import("../page/Admin/rootAdmin"));
const AdminAddCategories = React.lazy(() => import("../page/Admin/categories/addCategories"));
const AdminEditCategories = React.lazy(() => import("../page/Admin/categories/editCategories"));
const AdminListCategories = React.lazy(() => import("../page/Admin/categories/listCategories"));
/**Products */
const AdminAddProducts = React.lazy(() => import("../page/Admin/products/addProd"));
const AdminEditProducts = React.lazy(() => import("../page/Admin/products/editProd"));
const AdminListProducts = React.lazy(() => import("../page/Admin/products/listProd"));
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

// Suppliers
const AdminListSuppliers = React.lazy(
  () => import("../page/Admin/suppliers/listSuppliers")
);
const AdminAddSuppliers = React.lazy(
  () => import("../page/Admin/suppliers/addSuppliers")
);
const AdminEditSuppliers = React.lazy(
  () => import("../page/Admin/suppliers/editSuppliers")
);

/**BuyingFormat */
const AdminAddBuyingFormat = React.lazy(() => import("../page/Admin/buyingFormat/addBuyFormat"));
const AdminEditBuyingFormat = React.lazy(() => import("../page/Admin/buyingFormat/editBuyFormat"));
const AdminListBuyingFormat = React.lazy(() => import("../page/Admin/buyingFormat/listBuyFormat"));
/**Comments */
const AdminListComments = React.lazy(() => import("../page/Admin/comments/listComments"));

/**ConditionAuc */
const AdminConditionAuc = React.lazy(
  () => import("../page/Admin/conditionAuction/addConditionAuction")
);
const AdminEditConditionAuc = React.lazy(() => import("../page/Admin/conditionAuction/editCodAuc"));
const AdminListCondAuc = React.lazy(() => import("../page/Admin/conditionAuction/listCondAuc"));

/**CustomerService */
const AdminListCService = React.lazy(() => import("../page/Admin/customerService/listCService"));

/**discounts */
const AdminAddVoucher = React.lazy(() => import("../page/Admin/vouchers/addVoucher"));
const AdminEditVoucher = React.lazy(() => import("../page/Admin/vouchers/editVoucher"));
const AdminListVoucher = React.lazy(() => import("../page/Admin/vouchers/listVoucher"));
/**Orders */
const AdminListOrder = React.lazy(() => import("../page/Admin/orders/listOrder"));
const AdminDetailsOrder = React.lazy(() => import("../page/Admin/orders/detailsOrder"));

/**productionAuc */
const AdminAddProdAuc = React.lazy(() => import("../page/Admin/productAuction/addProdAuc"));
const AdminEditProdAuc = React.lazy(() => import("../page/Admin/productAuction/editProdAuc"));
const AdminListProdAuc = React.lazy(() => import("../page/Admin/productAuction/listProdAuc"));
/***RecycleBin */
const AdminRecycleBinCate = React.lazy(() => import("../page/Admin/recycleBinCate/allItemList"));
const AdminRecycleBin = React.lazy(() => import("../page/Admin/recycleBin/SoftDeletedProduct"));
const AdminRecycleBinOrder = React.lazy(() => import("../page/Admin/orders/recycleBinOrder"));
const AdminRecycleBinVoucher = React.lazy(() => import("../page/Admin/vouchers/softDelVoucher"));

/**User */
const AdminListUser = React.lazy(() => import("../page/Admin/users/listUser"));
const AdminListDeleted = React.lazy(() => import("../page/Admin/users/listDelete"));
const AdminEditUser = React.lazy(() => import("../page/Admin/users/editUser"));

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <Dashboard />,
    children: [
      { index: true, element: <Admin /> },
      { path: "addCategories", element: <AdminAddCategories /> },
      { path: "editCategories/:id", element: <AdminEditCategories /> },
      { path: "listCategories", element: <AdminListCategories /> },
      { path: "addProducts", element: <AdminAddProducts /> },
      { path: "editProducts/:id", element: <AdminEditProducts /> },
      { path: "listProducts", element: <AdminListProducts /> },
      { path: "addBrands", element: <AdminAddBrands /> },
      { path: "editBrands/:id", element: <AdminEditBrands /> },
      { path: "listBrands", element: <AdminListBrands /> },
      { path: "listSuppliers", element: <AdminListSuppliers /> },
      { path: "addSuppliers", element: <AdminAddSuppliers /> },
      { path: "editSuppliers/:id", element: <AdminEditSuppliers /> },
      { path: "addBuyingFormat", element: <AdminAddBuyingFormat /> },
      { path: "editBuyingFormat", element: <AdminEditBuyingFormat /> },
      { path: "listBuyingFormat", element: <AdminListBuyingFormat /> },
      { path: "listComments", element: <AdminListComments /> },
      { path: "addConditon", element: <AdminConditionAuc /> },
      { path: "editCondition", element: <AdminEditConditionAuc /> },
      { path: "listCondition", element: <AdminListCondAuc /> },
      { path: "listCusSer", element: <AdminListCService /> },
      { path: "addVouchers", element: <AdminAddVoucher /> },
      { path: "editVouchers/:id", element: <AdminEditVoucher /> },
      { path: "listVouchers", element: <AdminListVoucher /> },
      { path: "listOrders", element: <AdminListOrder /> },
      { path: "listDetailOrder/:id", element: <AdminDetailsOrder /> },
      { path: "addProdAuc", element: <AdminAddProdAuc /> },
      { path: "editProdAuc", element: <AdminEditProdAuc /> },
      { path: "listProdAuc", element: <AdminListProdAuc /> },
      { path: "recycleBin", element: <AdminRecycleBin /> },
      { path: "recycleBinCate", element: <AdminRecycleBinCate /> },
      { path: "recycleBinOrder", element: <AdminRecycleBinOrder /> },
      { path: "recycleBinVoucher", element: <AdminRecycleBinVoucher /> },
      { path: "listUser", element: <AdminListUser /> },
      { path: "listDelete", element: <AdminListDeleted /> },
      { path: "editUser", element: <AdminEditUser /> },
      { path: "*", element: <Dashboard /> },
    ],
  },
];

export default AdminRoutes;
