import {
  Font,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Order } from "../.../../types/order/order";

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
  fallback: true,
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Roboto",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    textAlign: "center",
  },
  total: {
    textAlign: "right",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});

const handleExportPDF = (order: Order) => {
  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        {/* Tiêu đề */}
        <Text style={styles.header}>Hóa Đơn Bán Hàng</Text>

        {/* Thông tin khách hàng */}
        <View style={styles.section}>
          <Text>Mã đơn hàng: {order._id}</Text>
          <Text>
            Khách hàng:{" "}
            {order.shipping.recipientName || "Không có tên khách hàng"}
          </Text>
          <Text>
            Số điện thoại:{" "}
            {order.shipping.phoneNumber || "Chưa có số điện thoại"}
          </Text>
          <Text>Địa chỉ: {order.shipping.address || "Chưa có địa chỉ"}</Text>
        </View>

        {/* Bảng chi tiết sản phẩm */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>STT</Text>
            <Text style={styles.tableCell}>Tên sản phẩm</Text>
            <Text style={styles.tableCell}>Số lượng</Text>
            <Text style={styles.tableCell}>Giá</Text>
            <Text style={styles.tableCell}>Thành tiền</Text>
          </View>

          {/* Dữ liệu trong bảng */}
          {order.cartDetails.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>
                {item.items[0]?.productVariant?.variant_name ||
                  "Không có tên sản phẩm"}
              </Text>
              <Text style={styles.tableCell}>
                {item.items[0]?.quantity || 0}
              </Text>
              <Text style={styles.tableCell}>
                {item.items[0]?.productVariant?.variant_price.toLocaleString(
                  "vi-VN"
                ) || 0}
                VNĐ
              </Text>
              <Text style={styles.tableCell}>
                {order.totalAmount?.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          ))}
        </View>

        {/* Tổng tiền */}
        <Text style={styles.total}>
          Tổng tiền: {order.totalAmount?.toLocaleString("vi-VN")} VNĐ
        </Text>
      </Page>
    </Document>
  );

  pdf(<MyDocument />)
    .toBlob()
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `HoaDon_${order._id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
};

export default handleExportPDF;
