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

    { label: "Mã giảm giá", to: "/admin/listVouchers" },
    { label: "Kho hàng", to: "/admin/listInventory" },
  ],
  attribute: [
    { label: "Màn hình", to: "/admin/list-screen" },
    { label: "Ram", to: "/admin/list-ram" },
  ],
  post: [{ label: "Bài viết", to: "/admin/list-post" }],
  orderCart: [
    { label: "Đơn hàng", to: "/admin/listOrders" },
    { label: "Đơn hàng đấu giá", to: "/admin/orderAuction" },
  ],

  supplier: [{ label: "Nhà cung cấp", to: "/admin/listSuppliers" }],
  brand: [{ label: "Thương hiệu", to: "/admin/listBrands" }],
  recycleBin: [
    { label: "Danh mục", to: "/admin/recycleBinCate" },
    { label: "Sản phẩm", to: "/admin/recycleBin" },
    { label: "Sản phẩm đấu giá", to: "/admin/delete-list-auction" },
    { label: "Mã giảm giá", to: "/admin/recycleBinVoucher" },
    { label: "Nhà cung cấp", to: "/admin/recycleBinSupplier" },
    { label: "Thương hiệu", to: "/admin/recycleBinBrand" },
    { label: "Đơn hàng", to: "/admin/recycleBinOrder" },

    { label: "Tương tác", to: "/admin/recycleBinComment" },

    // { label: "Đấu giá sản phẩm", to: "/admin/recycleBinProducTime" },
  ],
  categories: [
    { label: "Danh mục sản phẩm", to: "/admin/listCategories" },
    { label: "Danh mục bài viết", to: "/admin/list-categories-post" },
  ],
  comment: [{ label: "Tương tác", to: "/admin/listComments" }],
  homeAdmin: [{ label: "Trang chủ", to: "/admin" }],
  inbound: [{ label: "Nhập hàng biến thể", to: "/admin/listInbound" }],
  auctions: [
    { label: "Sản phẩm đấu giá", to: "/admin/list-auction" },
    { label: "Nhập hàng đấu giá", to: "/admin/listInboundV2" },
    { label: "Kho hàng đấu giá", to: "/admin/listInventoryV2" },
    // { label: "Phiên đấu giá", to: "/admin/listPriceRandAuct" },
    { label: "Thiết lập phiên đấu giá", to: "/admin/triggerAuct" },

    { label: "Danh sách duyệt ", to: "/admin/listCheckAuct" },
    // { label: "Danh sách cảnh báo", to: "/admin/listEnableAuct" },
    // { label: "Thời gian đấu giá", to: "/admin/listProdAuc" },
    // { label: "Đơn hàng đấu giá", to: "/admin/listOrderAuction" },
    // { label: "Đơn hàng hoàn trả", to: "/admin/recBinOrderAuction" },
  ],
};
