

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
    { label: "Sale", to: "/admin/listProducts" },
  ],
  recycleBin: [
    { label: "Danh mục", to: "/admin/recycleBinCate" },
    { label: "Sản phẩm", to: "/admin/recycleBin" },
  ],
};
