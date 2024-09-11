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
    { label: "Sản phẩm", to: "/admin/listProducts" },
    { label: "Mã giảm giá", to: "/admin/listVouchers" },
  ],
  productv2: [
    { label: "Sản phẩm", to: "/admin/listproduct" },
    { label: "Mã giảm giá", to: "/admin/listVouchers" },
    { label: "Kho hàng", to: "/admin/listInventory" },
  ],
  supplier: [
    { label: "Nhà cung cấp", to: "/admin/listSuppliers" },
  ],
  brand: [
    { label: "Thương hiệu", to: "/admin/listBrands" },
  ],
  recycleBin: [
    { label: "Danh mục", to: "/admin/recycleBinCate" },
    { label: "Sản phẩm", to: "/admin/recycleBin" },
    { label: "Mã giảm giá", to: "/admin/recycleBinVoucher" },
    { label: "Nhà cung cấp", to: "/admin/recycleBinSupplier" },
    { label: "Thương hiệu", to: "/admin/recycleBinBrand" },
    { label: "Đơn hàng", to: "/admin/recycleBinOrder" },
  ],
  categories: [{ label: "Danh mục", to: "/admin/listCategories" }],
  comment: [{ label: "Tương tác", to: "/admin/listComments" }],
  homeAdmin: [{ label: "Trang chủ", to: "/admin" }],
  inbound: [{ label: "Nhập hàng", to: "/admin/listInbound" }],

};
