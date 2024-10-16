import React from "react";
import { RouteObject } from "react-router-dom";
import Admin from "../page/Admin/Home/home";
const Dashboard = React.lazy(() => import("../page/Admin/rootAdmin"));
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
/**ProductsV2 */
const AdminAddProductV2 = React.lazy(
  () => import("../page/Admin/productV2/add")
);
const AdminAddVariant = React.lazy(
  () => import("../page/Admin/productV2/addVariant")
);
const AdminListProductV2 = React.lazy(
  () => import("../page/Admin/productV2/list")
);
const AdminEditProductV2 = React.lazy(
  () => import("../page/Admin/productV2/edit")
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
const AdminListDetailComments = React.lazy(
  () => import("../page/Admin/comments/listDetailComments")
);

/**ConditionAuc */


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
  () => import("../page/Admin/productTime/addProductTime")
);
const AdminEditProdAuc = React.lazy(
  () => import("../page/Admin/productTime/editProductTime")
);
const AdminListProdAuc = React.lazy(
  () => import("../page/Admin/productTime/list")
);


/**priceRand */
const AdminAddPriceRand = React.lazy(
  () => import("../page/Admin/priceRand/addPriceRand")
);
const AdminEditPriceRand = React.lazy(
  () => import("../page/Admin/priceRand/editPriceRand")
);
const AdminListPriceRand = React.lazy(
  () => import("../page/Admin/priceRand/listPriceRand")
);
/***RecycleBin */
const AdminRecycleBinCate = React.lazy(
  () => import("../page/Admin/recycleBinCate/allItemList")
);
const AdminRecycleBin = React.lazy(
  () => import("../page/Admin/recycleBin/SoftDeletedProduct")
);
const AdminRecycleBinOrder = React.lazy(
  () => import("../page/Admin/orders/recycleBinOrder")
);
const AdminRecycleBinVoucher = React.lazy(
  () => import("../page/Admin/vouchers/softDelVoucher")
);
const AdminRecycleBinSupplier = React.lazy(
  () => import("../page/Admin/recycleBinSupplier/SoftDeletedSupplier")
);
const AdminRecycleBinBrand = React.lazy(
  () => import("../page/Admin/recycleBinBrand/SoftDeletedBrand")
);
const AdminRecycleComment = React.lazy(
  () => import("../page/Admin/recycleBinComment/index")
);

const AdminRecybinProductTime = React.lazy(
  () => import("../page/Admin/productTime/deletedProductTime")
);

const AdminRecybinPriceRand = React.lazy(
  () => import("../page/Admin/priceRand/deletedPriceRand")
);

/**User */
const AdminListUser = React.lazy(() => import("../page/Admin/users/listUser"));
const AdminListDeleted = React.lazy(
  () => import("../page/Admin/users/listDelete")
);
const AdminEditUser = React.lazy(() => import("../page/Admin/users/editUser"));

// Inbound
const AdminListInbound = React.lazy(
  () => import("../page/Admin/inbound/listInbound")
);
const AdminAddInbound = React.lazy(
  () => import("../page/Admin/inbound/addInbound")
);
const AdminEditInbound = React.lazy(
  () => import("../page/Admin/inbound/editInbound")
);

//Inventory
const AdminAddInventory = React.lazy(
  () => import("../page/Admin/inventory/addInventory")
);
const AdminListInventory = React.lazy(
  () => import("../page/Admin/inventory/listInventory")
);

// OrderAuction 
const AdminListOrderAuction = React.lazy(
  () => import("../page/Admin/orderAuction/listOrder")
);
const AdminListRecybinOrderAuction = React.lazy(
  () => import("../page/Admin/orderAuction/recycleBinOrderAuction")
);

const AdminDetailOrderAuction = React.lazy(
  () => import("../page/Admin/orderAuction/detailsOrderAuction")
);
const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <Dashboard />,
    children: [
      { index: true, element: <Admin /> },
      { path: "addCategories", element: <AdminAddCategories /> },
      { path: "editCategories/:id", element: <AdminEditCategories /> },
      { path: "listCategories", element: <AdminListCategories /> },
      { path: "addproduct", element: <AdminAddProductV2 /> },
      { path: "product/:productId/addvariant", element: <AdminAddVariant /> },
      { path: "listproduct", element: <AdminListProductV2 /> },
      { path: "editproduct/:id", element: <AdminEditProductV2 /> },
      { path: "addProducts", element: <AdminAddProducts /> },
      { path: "editProducts/:id", element: <AdminEditProducts /> },
      { path: "listProducts", element: <AdminListProducts /> },
      { path: "addBrands", element: <AdminAddBrands /> },
      { path: "editBrands/:id", element: <AdminEditBrands /> },
      { path: "listBrands", element: <AdminListBrands /> },
      { path: "listSuppliers", element: <AdminListSuppliers /> },
      { path: "addSuppliers", element: <AdminAddSuppliers /> },
      { path: "editSuppliers/:id", element: <AdminEditSuppliers /> },
      { path: "listInbound", element: <AdminListInbound /> },
      { path: "addInbound", element: <AdminAddInbound /> },
      { path: "listInventory", element: <AdminListInventory /> },
      { path: "addInventory", element: <AdminAddInventory /> },
      { path: "editInbound/:id", element: <AdminEditInbound /> },
      { path: "addBuyingFormat", element: <AdminAddBuyingFormat /> },
      { path: "editBuyingFormat", element: <AdminEditBuyingFormat /> },
      { path: "listBuyingFormat", element: <AdminListBuyingFormat /> },
      { path: "listComments", element: <AdminListComments /> },
      { path: "listDetailComments/:id", element: <AdminListDetailComments /> },
  
      { path: "listCusSer", element: <AdminListCService /> },
      { path: "addVouchers", element: <AdminAddVoucher /> },
      { path: "editVouchers/:id", element: <AdminEditVoucher /> },
      { path: "listVouchers", element: <AdminListVoucher /> },
      { path: "listOrders", element: <AdminListOrder /> },
      { path: "listDetailOrder/:id", element: <AdminDetailsOrder /> },
      { path: "addProdAuc", element: <AdminAddProdAuc /> },
      { path: "editProdAuc/:id", element: <AdminEditProdAuc /> },
      { path: "listProdAuc", element: <AdminListProdAuc /> },

      { path: "addPriceRand", element: <AdminAddPriceRand /> },
      { path: "editPriceRand/:id", element: <AdminEditPriceRand /> },
      { path: "listPriceRand", element: <AdminListPriceRand /> },

      { path: "recycleBin", element: <AdminRecycleBin /> },
      { path: "recycleBinCate", element: <AdminRecycleBinCate /> },
      { path: "recycleBinOrder", element: <AdminRecycleBinOrder /> },
      { path: "recycleBinVoucher", element: <AdminRecycleBinVoucher /> },
      { path: "recycleBinSupplier", element: <AdminRecycleBinSupplier /> },
      { path: "recycleBinBrand", element: <AdminRecycleBinBrand /> },
      { path: "recycleBinComment", element: <AdminRecycleComment /> },
      { path: "recycleBinProducTime", element: <AdminRecybinProductTime /> },
      { path: "recycleBinPriceRand", element: <AdminRecybinPriceRand /> },
      { path: "listUser", element: <AdminListUser /> },
      { path: "listDelete", element: <AdminListDeleted /> },
      { path: "editUser", element: <AdminEditUser /> },
      { path: "listOrderAuction", element: <AdminListOrderAuction /> },
      { path: "detailOrderAuction/:id", element: <AdminDetailOrderAuction /> },
      { path: "recBinOrderAuction", element: <AdminListRecybinOrderAuction /> },
      { path: "*", element: <Dashboard /> },
    ],
  },
];

export default AdminRoutes;
