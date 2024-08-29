interface Link {
  label: string;
  to: string;
}

export const links: Record<string, Link[]> = {
  addProduct: [{ label: "Thêm sản phẩm", to: "/admin/addproduct" }],
  addVoucher: [{ label: "Thêm giảm giá", to: "/admin/addVouchers" }],
};
