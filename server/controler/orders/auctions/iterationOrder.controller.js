const iteractionOrderAucService = require('../../../services/orders/orderHq/oderAucIteration.service')
const PDFDocument = require("pdfkit");
const moment = require("moment-timezone");
const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");
// const fs = require('fs');
const ExcelJS = require("exceljs");
const path = require("path");
const { sendMail } = require("./mailer/mailerRefundCash/mailerRefunCashPDF");
const { sendMailExecl } = require("./mailer/mailerRefundCash/maillerRefunCashExecl");
const Product_v2 = require("../../../model/productAuction/productAuction");
const crypto = require('crypto');

const iteractionOrderAuController = {
  getOrderByUser: async(req, res)=>{
    try {
      const { userId } = req.query; // Lấy userId từ req.body
      const result = await iteractionOrderAucService.getOrderByUser(userId);
      res.status(200).json({
        success:true,
        status: 200,
        error: - 2,
        data: result
      })
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPendingOrderByUser : async(req,res)=>{
    try {
        const { userId } = req.query; // Lấy userId từ req.body
    
        // Gọi hàm từ Service
        const result = await iteractionOrderAucService.getPendingOrdersByUser(userId);
    
        // Trả về kết quả cho client
        return res.status(200).json({
          success: true,
          status: 200,
          data: result,
        });
    
      } catch (error) {
        // Xử lý lỗi
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
},

getConfirmedOrderByUser : async(req,res)=>{
  try {
      const { userId } = req.query; // Lấy userId từ req.body
  
      // Gọi hàm từ Service
      const result = await iteractionOrderAucService.getConfirmedOrdersByUser(userId);
  
      // Trả về kết quả cho client
      return res.status(200).json({
        success: true,
        status: 200,
        data: result,
      });
  
    } catch (error) {
      // Xử lý lỗi
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
},
    getShippingOrderByUser : async(req,res)=>{
        try {
            const { userId } = req.query; // Lấy userId từ req.body
        
            // Gọi hàm từ Service
            const result = await iteractionOrderAucService.getShippingOrdersByUser(userId);
        
            // Trả về kết quả cho client
            return res.status(200).json({
              success: true,
              status: 200,
              data: result,
            });
        
          } catch (error) {
            // Xử lý lỗi
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }
    },


    getReciveOrderByUser : async(req,res)=>{
        try {
            const { userId } = req.query; // Lấy userId từ req.body
        
            // Gọi hàm từ Service
            const result = await iteractionOrderAucService.getReciveOrdersByUser(userId);
        
            // Trả về kết quả cho client
            return res.status(200).json({
              success: true,
              status: 200,
              data: result,
            });
        
          } catch (error) {
            // Xử lý lỗi
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }

    },
    getCompleteOrderByUser: async(req, res)=>{
        try {
            const { userId } = req.query; // Lấy userId từ req.body
        
            // Gọi hàm từ Service
            const result = await iteractionOrderAucService.getCompleteOrdersByUser(userId);
        
            // Trả về kết quả cho client
            return res.status(200).json({
              success: true,
              status: 200,
              data: result,
            });
        
          } catch (error) {
            // Xử lý lỗi
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }
    },
    softDeleteReceivedOrders : async (req, res) => {
        try {
         
      
            const { orderId } = req.params; // Lấy userId từ URL
            const result = await iteractionOrderAucService.softDeleteReceivedOrdersByUser(orderId);
    
            res.status(200).json({
              success:true , 
              status: 200,
              message:"Đã xóa thành công",
               data: result.updateOrder }); // Trả về thông báo thành công
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateorderStatus: async(req, res)=>{
      try {
        const { orderId } = req.params; // Get orderId from URL parameters
        const { stateOrder } = req.body; // Get newStatus from the request body
    
        const updateOrderStatus = iteractionOrderAucService.updateOrderStatus(orderId, stateOrder)
  
        
        res.status(200).json({success:true ,
           status: 200,
            data: (await updateOrderStatus).order,
             msg: (await updateOrderStatus).message})
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  
    },

    updateorderStatusForCash: async(req, res)=>{
      try {
        const { orderIdCash } = req.params; // Get orderId from URL parameters
        const { stateOrderCash } = req.body; // Get newStatus from the request body
    
        const updateOrderStatusCash = iteractionOrderAucService.updateOrderStatusRefunCash(orderIdCash, stateOrderCash)
  
        
        res.status(200).json({success:true ,
           status: 200,
            data: (await updateOrderStatusCash).orderCash,
             msg: (await updateOrderStatusCash).message})
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  
    },

    exportInvoiceToPDF: async (req, res) => {
      try {
        const { orderId } = req.params;
        console.log('exportInvoiceToPDF', orderId);
        
        const order = await OrderAuction.findOne({
          _id: orderId,
          status: "disable",
        }).populate(
          "shippingAddress.userID",
          "recipientName phoneNumber address email"
        );
   
        const orderDetails = await OrderDetailAuction.find({
          order: orderId,
          status: "disable",
        }).lean();
    
        
        const paymentMethod = orderDetails[0].payment_method || "N/A"; // Giả sử tất cả orderDetails có cùng phương thức thanh toán
        const formatShippingType =
          orderDetails[0].formatShipping?.type || "Tiêu chuẩn"; // Giả sử tất cả orderDetails có cùng hình thức vận chuyển
  
        if (!order || !orderDetails.length) {
          throw new Error("Order not found or has no details");
        }
  
        const fontRegularPath = path.resolve(
          __dirname,
          "../../../fonts",
          "Arial.ttf"
        );
        const fontBoldPath = path.resolve(
          __dirname,
          "../../../fonts",
          "Arial-Bold.ttf"
        );
  
        const doc = new PDFDocument({ size: "A6", margin: 10 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=Invoice_${orderId}_${moment().format(
            "YYYYMMDD"
          )}.pdf`
        );
        doc.pipe(res);
  
        doc.registerFont("Arial", fontRegularPath);
        doc.registerFont("Arial-Bold", fontBoldPath);
  
        doc.on("error", (err) => {
          console.error("PDF generation error:", err);
          throw new Error("PDF generation failed");
        });
  
        // Add Header
        doc
          .fontSize(12) // Reduced from 14
          .font("Arial-Bold")
          .text("HÓA ĐƠN ĐẤU GIÁ HOÀN TRẢ", { align: "center" })
          .moveDown(0.5);
  
        // Add invoice details with smaller font
        doc
          .fontSize(7) // Reduced from 8
          .font("Arial")
          .text(`Mã hóa đơn: INV-${orderId.slice(-6)}`, { align: "right" })
          .text(
            `Ngày đặt hàng: ${moment(order.order_date).format("DD/MM/YYYY")}`,
            { align: "right" }
          )
          .moveDown(0.5);
  
        // Add shipping information with adjusted spacing
        doc
          .fontSize(8)
          .font("Arial-Bold")
          .text("Thông tin giao hàng")
          .font("Arial")
          .fontSize(7);
  
        const shippingInfo = [
          `Người nhận: ${order.shippingAddress.recipientName}`,
          `Số điện thoại: ${order.shippingAddress.phoneNumber}`,
          `Địa chỉ: ${order.shippingAddress.address}`,
        ];
        shippingInfo.forEach((info) => doc.text(info));
        doc.moveDown(0.5);
  
        // Payment section
        doc
          .fontSize(8)
          .font("Arial-Bold")
          .text("Thông tin thanh toán")
          .font("Arial")
          .fontSize(7);
  
        const paymentInfo = [
          `Phương thức thanh toán: ${paymentMethod || "N/A"}`,
          `Hình thức vận chuyển: ${formatShippingType || "Tiêu chuẩn"}`,
        ];
        paymentInfo.forEach((info) => doc.text(info));
        doc.moveDown(0.5);
  
        // Create order details table
        const tableTop = doc.y + 5;
        const tableHeaders = [
          "Sản phẩm",
          "SL",
          "Đơn giá",
          "Vận chuyển",
          "Thành tiền",
        ]; // Shortened headers
        const columnWidths = [110, 30, 50, 40, 50]; // Adjusted widths for A6
        let xPosition = 10; // Start from left margin
  
        doc.font("Arial-Bold").fontSize(7);
  
        // Render table headers with center alignment
        tableHeaders.forEach((header, i) => {
          doc.text(header, xPosition, tableTop, {
            width: columnWidths[i],
            align: "center",
          });
          xPosition += columnWidths[i];
        });
  
        // Draw table border lines
        const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0);
        doc
          .moveTo(10, tableTop - 3)
          .lineTo(10 + tableWidth, tableTop - 3)
          .stroke();
  
        // Draw header bottom border
        doc
          .moveTo(10, tableTop + 15)
          .lineTo(10 + tableWidth, tableTop + 15)
          .stroke();
  
        // Initialize y position for data rows
        let yPosition = tableTop + 18;
  
        // Draw table bottom border
        doc
          .moveTo(10, yPosition + 15)
          .lineTo(10 + tableWidth, yPosition + 15)
          .stroke();
  
        // Draw vertical borders for each column
        let columnXPos = 10;
        for (let i = 0; i <= columnWidths.length; i++) {
          doc
            .moveTo(columnXPos, tableTop - 3)
            .lineTo(columnXPos, yPosition + 15)
            .stroke();
          if (i < columnWidths.length) {
            columnXPos += columnWidths[i];
          }
        }
  
        // Render table content
  
        let totalAmount = 0;
        let totalShipping = 0;
  
        doc.font("Arial").fontSize(7);
  
        orderDetails.forEach((detail) => {
          xPosition = 10;
  
          const unitPrice = detail.totalAmount / detail.quantityDetails;
          totalAmount += detail.totalAmount;
          totalShipping += detail.shippingFee;
  
          const rowData = [
            detail.nameProduct,
            detail.quantityDetails.toString(),
            iteractionOrderAuController.formatCurrency(unitPrice),
            iteractionOrderAuController.formatCurrency(detail.shippingFee),
            iteractionOrderAuController.formatCurrency(detail.totalAmount),
          ];
  
          rowData.forEach((text, i) => {
            doc.text(text, xPosition, yPosition, {
              width: columnWidths[i],
              align: i === 0 ? "left" : "right",
            });
            xPosition += columnWidths[i];
          });
  
          yPosition += 12;
        });
        doc
          .moveTo(10, yPosition + 3)
          .lineTo(10 + tableWidth, yPosition + 3)
          .stroke();
        // Add summary
        doc.moveDown(2);
        const summaryBoxWidth = 200; // Reduced width
        const summaryBoxX = doc.page.width - summaryBoxWidth - 10;
        const summaryBoxY = doc.y;
  
        // Draw summary box (no border)
        doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, 50); // Just drawing the rectangle without stroke
  
        // Add summary content
        const summaryData = [
          {
            label: "Tổng tiền hàng:",
            value: iteractionOrderAuController.formatCurrency(totalAmount),
          },
          {
            label: "Phí vận chuyển:",
            value: iteractionOrderAuController.formatCurrency(totalShipping),
          },
          {
            label: "Tổng hoàn trả (không gồm phí vận chuyển):",
            value: iteractionOrderAuController.formatCurrency(
              totalAmount 
            ),
          },
        ];
  
        // Add "TỔNG KẾT" title
        doc
          .fontSize(8)
          .font("Arial-Bold")
          .text("TỔNG HÓA ĐƠN HOÀN TRẢ", summaryBoxX, summaryBoxY + 5, {
            width: summaryBoxWidth,
            align: "center",
          });
  
        // Add summary items
        let summaryY = summaryBoxY + 15;
        summaryData.forEach((item, index) => {
          // No line between items
          doc
            .fontSize(7)
            .font("Arial")
            .text(item.label, summaryBoxX + 5, summaryY, { continued: true });
  
          doc
            .font("Arial")
            .text(item.value, { align: "right", width: summaryBoxWidth - 10 });
  
          summaryY += 12;
        });
  
        // Footer text
        doc
          .moveDown(1)
          .fontSize(7)
          .font("Arial")
          .text("Cảm ơn quý khách!", { align: "center" })
          .moveDown(0.3)
          .text("Vui lòng giữ hóa đơn này để đối chiếu khi cần thiết.", {
            align: "center",
          });
  
        doc.end();
  
        const userMail = order.shippingAddress.email;
        const orderDetailV2 = await OrderDetailAuction.find({
          order: orderId,
          status: "disable",
        }).lean();
  
        const orderDetailSummary = await Promise.all(
          orderDetailV2.map(async (item) => {
            const productIds = item.productID;
  
            const product = await Product_v2.findOne({ _id: productIds }).lean();
  
            // Log to debug the issue
  
            // Check if product exists before accessing image property
            return {
              productName: item.nameProduct,
              quantity: item.quantityDetails,
              image: product ? product.image[0] : null, // Safe access to image
            };
          })
        );
        await sendMail(userMail, order, orderDetailSummary);
      } catch (error) {
        console.error("Error generating invoice PDF:", error);
        if (!res.headersSent) {
          res.status(500).json({
            error: "Failed to generate invoice PDF",
            details: error.message,
          });
        }
      }
    },
  
    exportInvoiceToExcel: async (req, res) => {
      try {
        const { orderId } = req.params;
  
        const order = await OrderAuction.findOne({
          _id: orderId,
          status: "disable",
        }).populate(
          "shippingAddress.userID",
          "recipientName phoneNumber address"
        );
  
        const orderDetails = await OrderDetailAuction.find({
          order: orderId,
          status: "disable",
        }).lean();
  
        if (!order || !orderDetails.length) {
          throw new Error("Order not found or has no details");
        }
  
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Invoice");
  
        // Định nghĩa các cột
        worksheet.columns = [
          { header: "Sản phẩm", key: "nameProduct", width: 30 },
          { header: "Số lượng", key: "quantity", width: 10 },
          { header: "Đơn giá", key: "unitPrice", width: 55 },
          { header: "Phí ship", key: "shippingFee", width: 15 },
          { header: "Tổng tiền", key: "totalPriceWithShipping", width: 55 },
        ];
  
        // Tiêu đề hóa đơn
        worksheet.mergeCells("A1:E1");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = "HÓA ĐƠN ĐẤU GIÁ HOÀN TRẢ";
        titleCell.font = { bold: true, size: 16 };
        titleCell.alignment = { vertical: "middle", horizontal: "center" };
  
        // Thông tin hóa đơn
        worksheet.addRow([]);
        worksheet.addRow([`Mã hóa đơn: INV-${orderId.slice(-6)}`]).font = {
          bold: true,
        };
        worksheet.addRow([
          `Ngày đặt hàng: ${moment(order.order_date).format("DD/MM/YYYY")}`,
        ]).font = { bold: true };
        worksheet.addRow([]);
  
        // Thông tin giao hàng
        const shippingTitle = worksheet.addRow(["THÔNG TIN GIAO HÀNG"]);
        shippingTitle.font = { bold: true, size: 12 };
  
        worksheet.addRow([`Người nhận: ${order.shippingAddress.recipientName}`]);
        worksheet.addRow([`Số điện thoại: ${order.shippingAddress.phoneNumber}`]);
        worksheet.addRow([`Địa chỉ: ${order.shippingAddress.address}`]);
        worksheet.addRow([]);
  
        // Thông tin thanh toán
        const paymentTitle = worksheet.addRow(["THÔNG TIN THANH TOÁN"]);
        paymentTitle.font = { bold: true, size: 12 };
  
        worksheet.addRow([
          `Phương thức thanh toán: ${orderDetails[0].payment_method || "N/A"}`,
        ]);
        worksheet.addRow([
          `Hình thức vận chuyển: ${
            orderDetails[0].formatShipping?.type || "Tiêu chuẩn"
          }`,
        ]);
        worksheet.addRow([]);
  
        // Thêm bảng sản phẩm
        const headerRow = worksheet.addRow([
          "Sản phẩm",
          "Số lượng",
          "Đơn giá",
          "Phí ship",
          "Tổng tiền (Không bao gồm phí vận chuyển)",
        ]);
  
        // Style cho header của bảng
        headerRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
  
        // Thêm chi tiết sản phẩm
        let totalAmount = 0;
        let totalShipping = 0;
  
        orderDetails.forEach((detail) => {
          const unitPrice = detail.totalAmount / detail.quantityDetails;
          totalAmount += detail.totalAmount;
          totalShipping += detail.shippingFee;
  
          const detailRow = worksheet.addRow([
            detail.nameProduct,
            detail.quantityDetails,
            iteractionOrderAuController.formatCurrency(unitPrice),
            iteractionOrderAuController.formatCurrency(detail.shippingFee),
            iteractionOrderAuController.formatCurrency(detail.totalAmount),
          ]);
  
          // Thêm border cho mỗi cell trong row
          detailRow.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = { vertical: "middle" };
          });
  
          // Căn giữa cột số lượng
          detailRow.getCell(2).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
  
          // Căn phải các cột giá
          [3, 4, 5].forEach((colIndex) => {
            detailRow.getCell(colIndex).alignment = {
              horizontal: "right",
              vertical: "middle",
            };
          });
        });
  
        // Thêm tổng kết
        worksheet.addRow([]);
  
        const summaryRows = [
          [
            "",
            "",
            "Tổng tiền hàng:",
            "",
            iteractionOrderAuController.formatCurrency(totalAmount),
          ],
          [
            "",
            "",
            "Phí vận chuyển:",
            "",
            iteractionOrderAuController.formatCurrency(totalShipping),
          ],
          [
            "",
            "",
            "Tổng hoàn trả (Không bao gồm vận chuyển):",
            "",
            iteractionOrderAuController.formatCurrency(totalAmount ),
          ],
        ];
  
        summaryRows.forEach((rowData) => {
          const row = worksheet.addRow(rowData);
          row.getCell(3).font = { bold: true };
          row.getCell(5).font = { bold: true };
          row.getCell(5).alignment = { horizontal: "right" };
        });
  
        // Gửi file
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=Invoice_${orderId}_${moment().format(
            "YYYYMMDD"
          )}.xlsx`
        );
  
        await workbook.xlsx.write(res);
        res.end();
        const userMail = order.shippingAddress.email;
        const orderDetailV2 = await OrderDetailAuction.find({
          order: orderId,
          status: "disable",
        }).lean();
  
        const orderDetailSummary = await Promise.all(
          orderDetailV2.map(async (item) => {
            const productIds = item.productID;
  
            const product = await Product_v2.findOne({ _id: productIds }).lean();
  
            // Log to debug the issue
  
            // Check if product exists before accessing image property
            return {
              productName: item.nameProduct,
              quantity: item.quantityDetails,
              image: product ? product.image[0] : null, // Safe access to image
            };
          })
        );
        await sendMailExecl(userMail, order, orderDetailSummary);
      } catch (error) {
        console.error("Error generating invoice Excel:", error);
        if (!res.headersSent) {
          res.status(500).json({
            error: "Failed to generate invoice Excel",
            details: error.message,
          });
        }
      }
    },
    formatCurrency: (amount) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    },
}

module.exports = iteractionOrderAuController