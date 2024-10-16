interface Link {
  label: string;
  to: string;
}

export const links: Record<string, Link[]> = {
  account: [
    { label: "Người dùng", to: "/admin/listUser" },
    { label: "Tài khoản đã khóa", to: "/admin/listDelete" },
  ],
  product: [
    { label: "Sản phẩm", to: "/admin/listproduct" },
    { label: "Sản phẩm đấu giá", to: "/admin/listProdAuc" },
    { label: "Khoảng định giá", to: "/admin/listPriceRand" },
    { label: "Mã giảm giá", to: "/admin/listVouchers" },
    { label: "Kho hàng", to: "/admin/listInventory" },
  ],
  orderCart: [
    { label: "Đơn hàng", to: "/admin/listOrders" },
    { label: "Đơn hàng đấu giá", to: "/admin/listOrderAuction" },
  ],

  supplier: [{ label: "Nhà cung cấp", to: "/admin/listSuppliers" }],
  brand: [{ label: "Thương hiệu", to: "/admin/listBrands" }],
  recycleBin: [
    { label: "Danh mục", to: "/admin/recycleBinCate" },
    { label: "Sản phẩm", to: "/admin/recycleBin" },
    { label: "Mã giảm giá", to: "/admin/recycleBinVoucher" },
    { label: "Nhà cung cấp", to: "/admin/recycleBinSupplier" },
    { label: "Thương hiệu", to: "/admin/recycleBinBrand" },
    { label: "Đơn hàng", to: "/admin/recycleBinOrder" },
    { label: "Đơn hàng đấu giá", to: "/admin/recBinOrderAuction" },
    { label: "Tương tác", to: "/admin/recycleBinComment" },
    { label: "Khoảng định giá", to: "/admin/recycleBinPriceRand" },
    { label: "Đấu giá sản phẩm", to: "/admin/recycleBinProducTime" },
  ],
  categories: [{ label: "Danh mục", to: "/admin/listCategories" }],
  comment: [{ label: "Tương tác", to: "/admin/listComments" }],
  homeAdmin: [{ label: "Trang chủ", to: "/admin" }],
  inbound: [{ label: "Nhập hàng", to: "/admin/listInbound" }],
};
