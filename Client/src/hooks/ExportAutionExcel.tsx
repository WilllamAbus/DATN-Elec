import * as XLSX from "xlsx";
import { Order } from "../.../../types/order/order";
const handleExportExcel = (order: Order) => {
  if (!order) return;

  // Định nghĩa kiểu đường viền
  const borderStyle = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Thông tin khách hàng
  const customerInfo = [
    [{ v: "HÓA ĐƠN BÁN HÀNG", s: { bold: true, fontSize: 16 } }],
    [],
    [{ v: "Mã đơn hàng:", s: { bold: true } }, order._id || "Không có"],
    [{ v: "Khách hàng:", s: { bold: true } }, order.shipping?.recipientName || "Không có tên khách hàng"],
    [{ v: "Số điện thoại:", s: { bold: true } }, order.shipping?.phoneNumber || "Chưa có số điện thoại"],
    [{ v: "Địa chỉ:", s: { bold: true } }, order.shipping?.address || "Chưa có địa chỉ"],
    [],
  ];

  // Tiêu đề bảng sản phẩm (có nền vàng & border)
  const productHeader = [
    [
      { v: "STT", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: borderStyle } },
      { v: "Tên sản phẩm", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: borderStyle } },
      { v: "Số lượng", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: borderStyle } },
      { v: "Giá", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: borderStyle } },
      { v: "Thành tiền", s: { bold: true, fill: { fgColor: { rgb: "FFFF00" } }, border: borderStyle } },
    ],
  ];

  // Chi tiết sản phẩm (có border)
  const productDetails = order.cartDetails?.map((item, index) => {
    const productName = item.itemAuction[0]?.product_randBib?.product_name || "Không có tên sản phẩm";
    const quantity = item.itemAuction[0]?.quantity || 0;
    const price = item.itemAuction[0]?.price || 0;
    const total = quantity * price;

    return [
      { v: index + 1, s: { border: borderStyle } },
      { v: productName, s: { border: borderStyle } },
      { v: quantity, s: { border: borderStyle } },
      { v: price, t: "n", z: "#,##0 VNĐ", s: { border: borderStyle } },
      { v: total, t: "n", z: "#,##0 VNĐ", s: { border: borderStyle } },
    ];
  }) || [];

  // Tổng tiền (có border)
  const totalAmount = [
    [],
    [
      { v: "TỔNG TIỀN:", s: { bold: true, border: borderStyle } },
      { v: order.totalPriceWithShipping || 0, t: "n", z: "#,##0 VNĐ", s: { border: borderStyle } },
    ],
  ];

  // Gộp tất cả dữ liệu
  const finalData = [...customerInfo, ...productHeader, ...productDetails, ...totalAmount];

  // Tạo worksheet với các cài đặt
  const worksheet = XLSX.utils.aoa_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();

  // Căn chỉnh cột
  worksheet["!cols"] = [
    { wch: 20 },  // STT
    { wch: 30 }, // Tên sản phẩm
    { wch: 10 }, // Số lượng
    { wch: 15 }, // Giá
    { wch: 20 }, // Thành tiền
  ];

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");

  // Xuất file Excel
  XLSX.writeFile(workbook, `HoaDon_${order._id}.xlsx`);
};

export default handleExportExcel;