interface Link {
  label: string;
  to: string;
}

export const links: Record<string, Link[]> = {
  addProduct: [{ label: "Thêm sản phẩm", to: "/admin/addproduct" }],
  addVoucher: [{ label: "Thêm giảm giá", to: "/admin/addVouchers" }],
  addProductAuction: [{ label: "Thêm sản phẩm", to: "/admin/add-product-auction" }],
  addCategoryPost: [{ label: "Thêm danh mục bài viết", to: "/admin/add-categories-post" }],
  addPost: [{ label: "Thêm bài viết", to: "/admin/add-post-product" }],
  addScreen: [{ label: "Thêm màn hình", to: "/admin/add-screen" }],
  addRam: [{ label: "Thêm màn hình", to: "/admin/add-ram" }],
};
