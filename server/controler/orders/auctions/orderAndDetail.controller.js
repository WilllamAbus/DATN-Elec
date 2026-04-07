const orderService = require("../../../services/orders/orderHq/ordersAndDetails.service");
const deleOrderService = require("../../../services/orders/orderHq/relationSoftDelOrder/deletedOrderIterUser");
const PDFDocument = require("pdfkit");
const moment = require("moment-timezone");
const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");
// const fs = require('fs');
const ExcelJS = require("exceljs");
const path = require("path");
const { sendMail } = require("./mailer/mailerForPDF");
const { sendMailExecl } = require("./mailer/mailerForExecl");
const Product_v2 = require("../../../model/productAuction/productAuction");
const crypto = require('crypto');
const orderAndDetailControler = {
  verifyPayment : async (payment, auctionDetails) => {
    try {
      // Cấu hình URL cho từng cổng thanh toán
      const paymentGateways = {
       
        VnPay: "https://sandbox.vnpayment.vn/paymentv2/verify", // URL kiểm tra VNPay
      };
  
      // Kiểm tra phương thức thanh toán có hợp lệ hay không
      if (!paymentGateways[payment]) {
        return {
          success: false,
          message: "Phương thức thanh toán không hợp lệ.",
        };
      }
  
      // Gửi yêu cầu xác minh tới API của cổng thanh toán
      const response = await axios.post(paymentGateways[payment], {
        auctionDetails, // Gửi thông tin chi tiết phiên đấu giá
      });
  
      // Kiểm tra trạng thái phản hồi từ API
      if (response.data && response.data.status === "success") {
        return {
          success: true,
          message: "Thanh toán đã được xác minh thành công.",
        };
      }
  
      return {
        success: false,
        message: response.data.message || "Xác minh thanh toán không thành công.",
      };
    } catch (error) {
      console.error("Lỗi khi xác minh thanh toán:", error.message);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi xác minh thanh toán.",
      };
    }
  },
  createOrder: async (req, res) => {
    try {
      const { userId, auctionDetails, payment } = req.body;
    //   if (!["MoMo", "VnPay", "Cash"].includes(payment)) {
    //     return res.status(400).json({
    //         success: false,
    //         status: 400,
    //         message: "Phương thức thanh toán không hợp lệ.",
    //     });
    // }


       // Xác minh thanh toán đối với MoMo hoặc VnPay
  
      const orderData = {
        userId,
        auctionDetails, // Rename to auctionID
        payment, // Rename to payment
      };

      const order = await orderService.createOrderWithDetails(orderData);
      if (payment === "MoMo") {
        res.status(200).json({
          success: true,
          status: 200,
          // Include MoMo payment link in response
          data: order,
        });
      } else if (payment === "VnPay") {
        res.status(200).json({
          success: true,
          status: 200,
          // Include VNPay payment link in response
          data: order,
        });
      } else if (payment === "Cash") {
        res.status(200).json({
          success: true,
          status: 201,
          message: "Thanh toán bằng tiền mặt",
          data: order,
        });
      } else {
        res.status(400).json({
          success: false,
          status: 400,
          message: "Phương thức thanh toán không hợp lệ",
        });
      }
    } catch (error) {
      console.error("error::", error);

      res.status(500).json({ message: error.message });
    }
  },
  getProductDetailsAuction: async (req, res) => {
    try {
      const { auctionId } = req.body; // Sử dụng req.body để lấy tham số từ request body
      if (!auctionId) {
        return res.status(400).json({ error: "auctionId là bắt buộc" });
      }
      const productDetails = await orderService.getAuctionProductDetails(
        auctionId
      );
      res.status(200).json({
        success: true,
        status: 201,

        data: productDetails,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateAndGetReceivedOrdersByUser: async (req, res) => {
    try {
      const { userId } = req.query; // Lấy userID từ URL
      const result = await orderService.getAndUpdateOrdersByUser(userId);

      res.status(200).json({
        status: 200,
        success: true,
        data: result,
      }); // Trả về danh sách đơn hàng đã cập nhật
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  softDeleteReceivedOrders: async (req, res) => {
    try {
      const { userId } = req.query; // Lấy userId từ URL
      const result = await orderService.softDeleteReceivedOrdersByUser(userId);

      res
        .status(200)
        .json({ success: true, status: 200, data: result.updateOrder }); // Trả về thông báo thành công
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getOrderByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await orderService.getOrderByUser(userId);
      res.status(200).json({
        success: true,
        status: 200,
        error: -2,
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getOrderDetails: async (req, res) => {
    try {

      const { 
        orderId, 
        status, 
        vnpayAmou, 
        vnpayBankCode, 
        vnpayOrderInfo, 
        vnpPayDate, 
        vnpayResponCode, 
        vnpTransNo 
    } = req.query ;// Include this required field } = req.query; // Sử dụng req.body để lấy tham số từ request body


  
      
      const orderDetails = await orderService.getOrderDetails(
        orderId,
        status,
        vnpayAmou,
        vnpayBankCode,
        vnpayOrderInfo,
        vnpPayDate,
        vnpayResponCode,
        vnpTransNo
    );

           
        res
          .status(200)
          .json({ success: true, status: 200, error: -2, data: orderDetails });
      
      // Tạo chuỗi cần kiểm tra chữ ký
 

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOrderDetailsDefault: async (req, res) => {
    try {

      const { 
        orderIds, 
       
    } = req.query ; 



  
      
      const orderDetailsDefault = await orderService.getOrderDetailDefaule(
        orderIds,
      
    );

           
        res
          .status(200)
          .json({ success: true, status: 200, error: -2, data: orderDetailsDefault });
      
      // Tạo chuỗi cần kiểm tra chữ ký
 

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getOrderDetailsAdmin: async (req, res) => {
    try {
      const { orderId } = req.params; // Sử dụng req.body để lấy tham số từ request body
      if (!orderId) {
        return res.status(400).json({ error: "orderId là bắt buộc" });
      }
      const orderDetails = await orderService.getOrderDetailAdmin(orderId);
      res
        .status(200)
        .json({ success: true, status: 200, error: -2, data: orderDetails });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
 verifyVnpaySignature : (queryParams) => {
    const vnp_SecureHash = queryParams.vnp_SecureHash;
    delete queryParams.vnp_SecureHash;
    delete queryParams.vnp_SecureHashType;
   
    const sortedParams = Object.keys(queryParams).sort().reduce((acc, key) => {
        acc[key] = queryParams[key];
        return acc;
    }, {});
   
    const hashData = Object.entries(sortedParams).map(([key, value]) => `${key}=${value}`).join('&');
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(hashData, 'utf-8')).digest('hex');
   
    return signed === vnp_SecureHash;
   },
  completeOrder: async (req, res) => {
    try {
   
      const { orderId } = req.body; 
      if (!orderId) {
        return res.status(400).json({ error: "orderId là bắt buộc" });
      }
      const result = await orderService.completeOrder(orderId);
      res.status(201).json({
        success: true,
        status: 201,

        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search || "";

      const { ordersDeleted, totalPages, currentPage } =
        await orderService.getAllOrders(page, pageSize, search);

      return res.status(200).json({
        status: 200,
        message: "Lấy danh sách đơn hàng  thành công",
        data: {
          ordersDeleted,
          totalPages,
          currentPage,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Lỗi server: " + error.message,
      });
    }
  },

  getDeletedOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search || "";

      const { ordersDeleted, totalPages, currentPage } =
        await orderService.getDeletedOrders(page, pageSize, search);

      return res.status(200).json({
        status: 200,
        message: "Lấy danh sách đơn hàng đã xóa thành công",
        data: {
          ordersDeleted,
          totalPages,
          currentPage,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Lỗi server: " + error.message,
      });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      res.status(200).json({ success: true, status: 200, data: order });
    } catch (error) {
      console.error("Error getting order by ID:", error.message);
      res
        .status(500)
        .json({ message: `Error retrieving order: ${error.message}` });
    }
  },

  restoreOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await orderService.restoreOrder(id);

      res.status(200).json({ success: true, status: 200, data: order });
    } catch (error) {
      console.error("Error restoring order:", error.message);
      res
        .status(500)
        .json({ message: `Error restoring order: ${error.message}` });
    }
  },

  softDeleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await orderService.softDeleteOrder(id);

      res.status(200).json({ success: true, status: 200, data: order });
    } catch (error) {
      console.error("Error soft deleting order:", error.message);
      res
        .status(500)
        .json({ message: `Error soft deleting order: ${error.message}` });
    }
  },

  searchOrdersByPhoneNumber: async (req, res) => {
    // Get page and limit from query params

    try {
      const { page, search } = req.query;
      const limit = 12;
      // Call the service function to search orders by phone number
      const result = await orderService.searchOrdersByPhoneNumber(
        page,
        search,
        limit
      );

      // Respond with the paginated result
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  deleteOrderAndByUser: async (req, res) => {
    try {
      // Extracting parameters from the request body
      const { userId, orderId, serviceRequestId, reason, notes } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required." });
      }

      // Proceed with your logic using orderId

      // Validate required fields

      // Handle the auction deletion and service logging
      const result = await deleOrderService.handleAuctionDeletion(
        userId,
        orderId,
        serviceRequestId,
        reason,
        notes
      );

      // Respond with success and result
      res.status(200).json({ success: true, result });
    } catch (error) {
      // Respond with error message
      res.status(500).json({ success: false, message: error.message });
    }
  },

  exportInvoiceToPDF: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await OrderAuction.findOne({
        _id: orderId,
        status: "active",
      }).populate(
        "shippingAddress.userID",
        "recipientName phoneNumber address email"
      );

      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
        status: "active",
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
        .text("HÓA ĐƠN ĐẤU GIÁ", { align: "center" })
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
          orderAndDetailControler.formatCurrency(unitPrice),
          orderAndDetailControler.formatCurrency(detail.shippingFee),
          orderAndDetailControler.formatCurrency(detail.totalPriceWithShipping),
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
          value: orderAndDetailControler.formatCurrency(totalAmount),
        },
        {
          label: "Phí vận chuyển:",
          value: orderAndDetailControler.formatCurrency(totalShipping),
        },
        {
          label: "Tổng thanh toán:",
          value: orderAndDetailControler.formatCurrency(
            totalAmount + totalShipping
          ),
        },
      ];

      // Add "TỔNG KẾT" title
      doc
        .fontSize(8)
        .font("Arial-Bold")
        .text("TỔNG HÓA ĐƠN", summaryBoxX, summaryBoxY + 5, {
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
        status: "active",
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
        status: "active",
      }).populate(
        "shippingAddress.userID",
        "recipientName phoneNumber address"
      );

      const orderDetails = await OrderDetailAuction.find({
        order: orderId,
        status: "active",
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
        { header: "Đơn giá", key: "unitPrice", width: 15 },
        { header: "Phí ship", key: "shippingFee", width: 15 },
        { header: "Tổng tiền", key: "totalPriceWithShipping", width: 20 },
      ];

      // Tiêu đề hóa đơn
      worksheet.mergeCells("A1:E1");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = "HÓA ĐƠN ĐẤU GIÁ";
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
        "Tổng tiền",
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
          orderAndDetailControler.formatCurrency(unitPrice),
          orderAndDetailControler.formatCurrency(detail.shippingFee),
          orderAndDetailControler.formatCurrency(detail.totalPriceWithShipping),
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
          orderAndDetailControler.formatCurrency(totalAmount),
        ],
        [
          "",
          "",
          "Phí vận chuyển:",
          "",
          orderAndDetailControler.formatCurrency(totalShipping),
        ],
        [
          "",
          "",
          "Tổng thanh toán:",
          "",
          orderAndDetailControler.formatCurrency(totalAmount + totalShipping),
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
        status: "active",
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
};

module.exports = orderAndDetailControler;
