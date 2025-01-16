import * as XLSX from "xlsx";
import { Order } from "../.../../types/order/order";

const handleExportExcel = (order: Order) => {
  // Thông tin khách hàng
  const customerInfo = [
    ["HÓA ĐƠN BÁN HÀNG"], // Tiêu đề lớn
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

  // Tạo worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(finalData);

  // Định dạng cột
  const wscols = [
    { wch: 10 }, // STT
    { wch: 30 }, // Tên sản phẩm
    { wch: 15 }, // Số lượng
    { wch: 20 }, // Giá
    { wch: 20 }, // Thành tiền
  ];
  worksheet["!cols"] = wscols;

  // Căn giữa tiêu đề
  worksheet["A1"].s = {
    font: { bold: true, sz: 16 }, // Cỡ chữ lớn hơn
    alignment: { horizontal: "center" }, // Căn giữa
  };

  // Định dạng header
  const headerRange = XLSX.utils.decode_range("A7:E7");
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: C });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } }, // Chữ trắng
        fill: { fgColor: { rgb: "4CAF50" } }, // Nền xanh
        alignment: { horizontal: "center" }, // Căn giữa
      };
    }
  }

  // Định dạng border cho toàn bộ bảng
  Object.keys(worksheet).forEach((cell) => {
    if (cell[0] === "!") return; // Bỏ qua metadata
    worksheet[cell].s = {
      ...worksheet[cell].s,
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  });

  // Tạo workbook và xuất file
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");
  XLSX.writeFile(workbook, `HoaDon_${order._id}.xlsx`);
};

export default handleExportExcel;
