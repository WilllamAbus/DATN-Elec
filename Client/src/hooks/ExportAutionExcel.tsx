import * as XLSX from "xlsx";
import { Order } from "../.../../types/order/order";

const handleExportExcel = (order: Order) => {
  // Chuẩn bị dữ liệu thông tin khách hàng
  const customerInfo = [
    ["HÓA ĐƠN BÁN HÀNG"],
    ["Mã đơn hàng:", order._id],
    ["Khách hàng:", order.shipping.recipientName || "Không có tên khách hàng"],
    ["Số điện thoại:", order.shipping.phoneNumber || "Chưa có số điện thoại"],
    ["Địa chỉ:", order.shipping.address || "Chưa có địa chỉ"],
  ];

  // Chuẩn bị dữ liệu chi tiết sản phẩm
  const productDetails = [
    ["STT", "Tên sản phẩm", "Số lượng", "Giá", "Thành tiền"],
    ...order.cartDetails.map((item, index) => [
      index + 1,
      item.itemAuction[0]?.product_randBib?.product_name || "Không có tên sản phẩm",
      item.itemAuction[0]?.quantity || 0,
      (item.itemAuction[0]?.price || 0).toLocaleString("vi-VN") + " VNĐ",
      (
        (item.itemAuction[0]?.quantity || 0) * (item.itemAuction[0]?.price || 0)
      ).toLocaleString("vi-VN") + " VNĐ",
    ]),
  ];

  // Thêm tổng tiền vào cuối
  const totalAmount = [
    [],
    ["Tổng tiền:", order.totalPriceWithShipping?.toLocaleString("vi-VN") + " VNĐ"],
  ];

  // Kết hợp tất cả dữ liệu
  const finalData = [...customerInfo, [], ...productDetails, [], ...totalAmount];

  // Tạo workbook và worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(finalData);
  
  // Định dạng cột
  const columnWidths = [
    { wch: 5 },  // STT
    { wch: 30 }, // Tên sản phẩm
    { wch: 10 }, // Số lượng
    { wch: 15 }, // Giá
    { wch: 15 }, // Thành tiền
  ];
  worksheet['!cols'] = columnWidths;

  // Tô màu header
  const headerRange = XLSX.utils.encode_range({ s: { r: 6, c: 0 }, e: { r: 6, c: 4 } });
  worksheet[headerRange].s = { fill: { fgColor: { rgb: "FFFF00" } }, font: { bold: true } };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");

  // Xuất file Excel
  XLSX.writeFile(workbook, `HoaDon_${order._id}.xlsx`);
};

export default handleExportExcel;
