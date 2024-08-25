const { Schema, model } = require("mongoose");

const inventorySchema = Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "product_v2", required: true }, // Tham chiếu đến mô hình Product (Sản phẩm)
    quantity: { type: Number, required: true }, // Số lượng hàng tồn kho
    location: {
      warehouse: { type: String, required: true }, // Kho hàng chính hoặc cửa hàng chính
      section: { type: String, required: false }, // Khu vực hoặc tầng lưu trữ trong kho hoặc cửa hàng
      aisle: { type: String, required: false }, // Lối đi hoặc khu vực lưu trữ cụ thể
      shelf: { type: String, required: false }, // Giá hoặc kệ lưu trữ cụ thể
      bin: { type: String, required: false }, // Thùng hoặc hộp lưu trữ cụ thể
    }, // Vị trí lưu trữ (ví dụ: kho hàng, cửa hàng)
    //   supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Tham chiếu đến mô hình Supplier (Nhà cung cấp)
    restockLevel: { type: Number, required: true }, // Mức độ tồn kho tại đó cần phải được bổ sung
    restockDate: { type: Date }, // Ngày bổ sung hàng tồn kho gần nhất
    batchNumber: { type: String, default: "" }, // Số lô hàng nhập sau (bổ sung giá trị mặc định là chuỗi rỗng)
    batchDate: { type: Date },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true }, // Ngày sản xuất hoặc ngày nhập kho của lô hàng
    reservations: [
      { type: Schema.Types.ObjectId, ref: "resversation", default: [] }, // Danh sách các đặt chỗ liên quan đến sản phẩm này
    ],
    auctionQuantity: { type: Number, default: 0 }, // Số lượng sản phẩm đã được đấu giá
    isActive: { type: Boolean, default: true }, // Đánh dấu trạng thái hoạt động
    status: { type: String, default: "active" }, // Trạng thái của bản ghi kho
    disabledAt: { type: Date, default: null }, // Ngày cập nhật trạng thái bị vô hiệu hóa
    createdAt: { type: Date, default: Date.now }, // Ngày tạo bản ghi kho
    updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật bản ghi kho gần nhất
  },
  {
    collection: "inventory",
  }
);

// Trước khi lưu trữ hoặc cập nhật tài liệu
inventorySchema.pre("save", function (next) {
  if (this.quantity < 0) {
    return next(new Error("Quantity cannot be negative."));
  }
  next();
});
module.exports = model("inventory", inventorySchema);
