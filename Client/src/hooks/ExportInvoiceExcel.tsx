import * as XLSX from "xlsx";
import { Order } from "../.../../types/order/order";

const handleExportExcel = (order: Order) => {
  // Thông tin khách hàng
  const customerInfo = [
    ["Hóa Đơn Bán Hàng"],
    ["Mã đơn hàng:", order._id],
    ["Khách hàng:", order.shipping.recipientName || "Không có tên khách hàng"],
    ["Số điện thoại:", order.shipping.phoneNumber || "Chưa có số điện thoại"],
    ["Địa chỉ:", order.shipping.address || "Chưa có địa chỉ"],
    [],
  ];

  // Dữ liệu header cho bảng sản phẩm
  const headers = ["STT", "Tên sản phẩm", "Số lượng", "Giá", "Thành tiền"];

  // Chuyển đổi dữ liệu đơn hàng thành mảng để đưa vào Excel
  const productDetails = order.cartDetails.map((item, index) => [
    index + 1,
    item.items[0]?.productVariant?.variant_name || "Không có tên sản phẩm",
    item.items[0]?.quantity || 0,
    (item.items[0]?.productVariant?.variant_price || 0).toLocaleString("vi-VN") +
      " VNĐ",
    (
      (item.items[0]?.quantity || 0) * (item.items[0]?.productVariant?.variant_price || 0)
    ).toLocaleString("vi-VN") + " VNĐ",
  ]);

  // Thêm tổng tiền vào cuối bảng
  const totalAmount = [
    [],
    ["Tổng tiền:", order.totalPriceWithShipping?.toLocaleString("vi-VN") + " VNĐ"],
  ];

  // Kết hợp tất cả dữ liệu
  const finalData = [...customerInfo, headers, ...productDetails, ...totalAmount];

  // Tạo worksheet và workbook
  const worksheet = XLSX.utils.aoa_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");

  // Xuất file Excel
  XLSX.writeFile(workbook, `HoaDon_${order._id}.xlsx`);
};

export default handleExportExcel;
