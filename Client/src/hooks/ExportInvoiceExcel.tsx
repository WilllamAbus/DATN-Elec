import * as XLSX from "xlsx";
import { Order } from "../.../../types/order/order";

const handleExportExcel = (order: Order) => {
  if (!order) return;

  // Thông tin khách hàng
  const customerInfo = [
    [{ v: "HÓA ĐƠN BÁN HÀNG", s: { bold: true, fontSize: 16, alignment: { horizontal: "center" } } }],
    [],
    [{ v: "Mã đơn hàng:", s: { bold: true } }, order._id || "Không có"],
    [{ v: "Khách hàng:", s: { bold: true } }, order.shipping?.recipientName || "Không có tên khách hàng"],
    [{ v: "Số điện thoại:", s: { bold: true } }, order.shipping?.phoneNumber || "Chưa có số điện thoại"],
    [{ v: "Địa chỉ:", s: { bold: true } }, order.shipping?.address || "Chưa có địa chỉ"],
    [],
  ];

  // Tiêu đề bảng sản phẩm
  const headers = [
    [
      { v: "STT", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } } },
      { v: "Tên sản phẩm", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } } },
      { v: "Số lượng", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } } },
      { v: "Giá", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } } },
      { v: "Thành tiền", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } } },
    ],
  ];

  // Dữ liệu chi tiết sản phẩm
  const productDetails = order.cartDetails?.map((item, index) => {
    const productName = item.items[0]?.productVariant?.variant_name || "Không có tên sản phẩm";
    const quantity = item.items[0]?.quantity || 0;
    const price = item.items[0]?.productVariant?.variant_price || 0;
    const total = quantity * price;

    return [
      { v: index + 1, s: { border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } } },
      { v: productName, s: { border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } } },
      { v: quantity, s: { border: { top: "thin", bottom: "thin", left: "thin", right: "thin" }, alignment: { horizontal: "center" } } },
      { v: price.toLocaleString("vi-VN") + " VNĐ", s: { border: { top: "thin", bottom: "thin", left: "thin", right: "thin" }, alignment: { horizontal: "right" } } },
      { v: total.toLocaleString("vi-VN") + " VNĐ", s: { border: { top: "thin", bottom: "thin", left: "thin", right: "thin" }, alignment: { horizontal: "right" } } },
    ];
  }) || [];

  // Tổng tiền
  const totalAmount = [
    [],
    [
      { v: "TỔNG TIỀN:", s: { bold: true, alignment: { horizontal: "right" } } },
      { v: (order.totalPriceWithShipping || 0).toLocaleString("vi-VN") + " VNĐ", s: { bold: true, alignment: { horizontal: "right" } } },
    ],
  ];

  // Gộp tất cả dữ liệu
  const finalData = [...customerInfo, ...headers, ...productDetails, ...totalAmount];

  // Tạo worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(finalData);

  // Cài đặt độ rộng cột
  worksheet["!cols"] = [
    { wch: 20 }, // STT
    { wch: 30 }, // Tên sản phẩm
    { wch: 15 }, // Số lượng
    { wch: 20 }, // Giá
    { wch: 25 }, // Thành tiền
  ];

  // Tạo workbook và thêm worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");

  // Xuất file Excel
  XLSX.writeFile(workbook, `HoaDon_${order._id}.xlsx`);
};

export default handleExportExcel;
