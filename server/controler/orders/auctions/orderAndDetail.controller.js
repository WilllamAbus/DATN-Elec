const orderService = require("../../../services/orders/orderHq/ordersAndDetails.service");
const deleOrderService = require("../../../services/orders/orderHq/relationSoftDelOrder/deletedOrderIterUser");
const PDFDocument = require('pdfkit');
const moment = require("moment-timezone");
const OrderAuction = require("../../../model/orders/auctionsOrders/aucOrders.model");
const OrderDetailAuction = require("../../../model/orders/auctionsOrders/aucOrderDetail.model");
// const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require('path');
const orderAndDetailControler = {
    createOrder : async (req, res) => {
      try {
        const { userId, auctionDetails, payment } = req.body;
        const orderData = {
          userId,
          auctionDetails, // Rename to auctionID
           payment, // Rename to payment
        };
    
    
    
        const order = await orderService.createOrderWithDetails(orderData);
        if (payment === 'MoMo') {
          res.status(200).json({
            success: true,
            status: 200,
            // Include MoMo payment link in response
            data: order
          });
        } else if (payment === 'VnPay') {
          res.status(200).json({
            success: true,
            status: 200,
            // Include VNPay payment link in response
            data: order
          });
        } else if (payment === 'Cash') {
          res.status(200).json({
            success: true,
            status: 201,
            message: 'Thanh toán bằng tiền mặt',
            data: order
          });
        } else {
          res.status(400).json({
            success: false,
            status: 400,
            message: 'Phương thức thanh toán không hợp lệ'
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
                return res.status(400).json({ error: 'auctionId là bắt buộc' });
            }
            const productDetails = await orderService.getAuctionProductDetails(auctionId);
            res.status(200).json({
                success: true,
                status: 201,
               
                data: productDetails
              });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateAndGetReceivedOrdersByUser : async (req, res) => {
        try {
            const { userId } = req.query; // Lấy userID từ URL
            const result = await orderService.getAndUpdateOrdersByUser(userId);
    
        
    
            res.status(200).json({
                status: 200,
                success:true,
                data:result
            }); // Trả về danh sách đơn hàng đã cập nhật
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    softDeleteReceivedOrders : async (req, res) => {
        try {
            const { userId } = req.query; // Lấy userId từ URL
            const result = await orderService.softDeleteReceivedOrdersByUser(userId);
    
            res.status(200).json({success:true , status: 200, data: result.updateOrder }); // Trả về thông báo thành công
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getOrderByUser: async(req, res)=>{
      try {
        const userId = req.user.id;
        const result = await orderService.getOrderByUser(userId);
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
    getOrderDetails : async (req, res) => {
        try {
            const { orderId } =  req.query; // Sử dụng req.body để lấy tham số từ request body
           console.log('getOrderDetails', orderId);
           
            const orderDetails = await orderService.getOrderDetails(orderId);
            res.status(200).json({ success: true,
                status: 200,
                error: -2,
                data: orderDetails});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getOrderDetailsAdmin : async (req, res) => {
      try {
          const { orderId } =  req.params; // Sử dụng req.body để lấy tham số từ request body
          if (!orderId) {
              return res.status(400).json({ error: 'orderId là bắt buộc' });
          }
          const orderDetails = await orderService.getOrderDetailAdmin(orderId);
          res.status(200).json({ success: true,
              status: 200,
              error: -2,
              data: orderDetails});
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  },

    completeOrder: async (req, res) => {
        try {
            const { orderId } = req.body; // Sử dụng req.body để lấy tham số từ request body
            if (!orderId) {
                return res.status(400).json({ error: 'orderId là bắt buộc' });
            }
            const result = await orderService.completeOrder(orderId);
            res.status(201).json({ 
              success: true,
                status: 201,
            
                data: result});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllOrders: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const search = req.query.search   
   || '';
  
        const { ordersDeleted, totalPages, currentPage } = await orderService.getAllOrders(page, pageSize, search);
  
        return res.status(200).json({
          status: 200,
          message: 'Lấy danh sách đơn hàng  thành công',
          data: {
            ordersDeleted,
            totalPages,
            currentPage,
          },
        });
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: 'Lỗi server: ' + error.message,
        });
      }
  },

  getDeletedOrders : async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search   
 || '';

      const { ordersDeleted, totalPages, currentPage } = await orderService.getDeletedOrders(page, pageSize, search);

      return res.status(200).json({
        status: 200,
        message: 'Lấy danh sách đơn hàng đã xóa thành công',
        data: {
          ordersDeleted,
          totalPages,
          currentPage,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Lỗi server: ' + error.message,
      });
    }
},
      getOrderById : async (req, res) => {
        try {
          const { id } = req.params;
          const order = await orderService.getOrderById(id);
      
          res.status(200).json({ success: true,status: 200, data: order });
        } catch (error) {
          console.error('Error getting order by ID:', error.message);
          res.status(500).json({ message: `Error retrieving order: ${error.message}` });
        }
      },

      restoreOrder : async (req, res) => {
        try {
          const { id } = req.params;
          const order = await orderService.restoreOrder(id);
      
          res.status(200).json({ success: true,status:200, data: order });
        } catch (error) {
          console.error('Error restoring order:', error.message);
          res.status(500).json({ message: `Error restoring order: ${error.message}` });
        }
      },

      softDeleteOrder : async (req, res) => {
        try {
          const { id } = req.params;
          const order = await orderService.softDeleteOrder(id);
      
          res.status(200).json({ success: true,status:200, data: order });
        } catch (error) {
          console.error('Error soft deleting order:', error.message);
          res.status(500).json({ message: `Error soft deleting order: ${error.message}` });
        }
      },

 

      searchOrdersByPhoneNumber : async (req, res) => {
         // Get page and limit from query params
      
        try {
          const { page, search } = req.query;
          const limit = 12; 
          // Call the service function to search orders by phone number
          const result = await orderService.searchOrdersByPhoneNumber(page, search, limit);
      
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
          const { userId, orderId,serviceRequestId, reason, notes } = req.body;
        
          if (!orderId) {
            return res.status(400).json({ error: "Order ID is required." });
          }
        
          // Proceed with your logic using orderId
      
          
          // Validate required fields
        
          // Handle the auction deletion and service logging
          const result = await deleOrderService.handleAuctionDeletion(userId, orderId,serviceRequestId, reason, notes);

          
          // Respond with success and result
          res.status(200).json({ success: true,  result });
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
            status: 'active'
          }).populate('shippingAddress.userID', 'recipientName phoneNumber address');
      
          const orderDetails = await OrderDetailAuction.find({
            order: orderId,
            status: 'active'
          }).lean();
      
          if (!order || !orderDetails.length) {
            throw new Error('Order not found or has no details');
          }
          const fontRegularPath = path.resolve(__dirname, '../../../fonts', 'Arial.ttf');
          const fontBoldPath = path.resolve(__dirname, '../../../fonts', 'Arial-Bold.ttf');
      
          const doc = new PDFDocument({ size: 'A4', margin: 40 });
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=Invoice_${orderId}_${moment().format('YYYYMMDD')}.pdf`);
          doc.pipe(res);
      
          doc.registerFont('Arial', fontRegularPath);
          doc.registerFont('Arial-Bold', fontBoldPath);
          doc.font('Arial');
        
      
          // Load a font that supports Vietnamese characters
 
      
          doc.on('error', (err) => {
            console.error('PDF generation error:', err);
            throw new Error('PDF generation failed');
          });
      
          // Add Header
          doc.fontSize(24)
             .font('Arial-Bold')
             .text('HÓA ĐƠN ĐẤU GIÁ', { align: 'center' })
             .moveDown();
      
          // Add invoice details
          doc.fontSize(10)
             .font('Arial')
             .text(`Mã hóa đơn: INV-${orderId.slice(-6)}`, { align: 'right' })
             .text(`Ngày đặt hàng: ${moment(order.order_date).format('DD/MM/YYYY')}`, { align: 'right' })
             .moveDown();
      
          // Add shipping information
          doc.fontSize(13)
             .font('Arial-Bold')
             .text('Thông tin giao hàng')
             .font('Arial')
             .fontSize(10);
      
          const shippingInfo = [
            `Người nhận: ${order.shippingAddress.recipientName}`,
            `Số điện thoại: ${order.shippingAddress.phoneNumber}`,
            `Địa chỉ: ${order.shippingAddress.address}`
          ];
          shippingInfo.forEach(info => doc.text(info));
          doc.moveDown();
      
          // Payment and Shipping Method Section
          const firstDetail = orderDetails[0];
          doc.fontSize(12)
             .font('Arial-Bold')
             .text('Thông tin thanh toán')
             .font('Arial')
             .fontSize(10);
      
          const paymentInfo = [
            `Phương thức thanh toán: ${firstDetail.payment_method || 'N/A'}`,
            `Hình thức vận chuyển: ${firstDetail.formatShipping?.type || 'Tiêu chuẩn'}`,
         
          ];
          paymentInfo.forEach(info => doc.text(info));
          doc.moveDown();
      
          // Create order details table
          const tableTop = doc.y + 20;
          const tableHeaders = ['Sản phẩm', 'Số lượng', 'Đơn giá', 'Phí ship', 'Tổng tiền'];
          const columnWidths = [180, 70, 90, 90, 90];
          
          let xPosition = 50;
          doc.font('Arial-Bold').fontSize(10);
          
          // Vẽ tiêu đề bảng với đường viền trên, dưới và hai bên
          tableHeaders.forEach((header, i) => {
            doc.text(header, xPosition + (i === 0 ? 5 : -5), tableTop, { 
              width: columnWidths[i],
              align: 'center',
            });
            xPosition += columnWidths[i];
          });
          
          // Đường viền trên tiêu đề
          doc.moveTo(50, tableTop - 5)
             .lineTo(50 + columnWidths.reduce((acc, width) => acc + width, 0), tableTop - 5)
             .lineWidth(1.5)
             .stroke();
          
          // Đường viền dưới tiêu đề
          doc.moveTo(50, tableTop + 15)
             .lineTo(50 + columnWidths.reduce((acc, width) => acc + width, 0), tableTop + 15)
             .lineWidth(1.5)
             .stroke();
          
          // Đường viền bên trái của bảng (cho cả tiêu đề và dòng sản phẩm)
          doc.moveTo(50, tableTop - 5)
             .lineTo(50, tableTop + 35) // Độ dài để bao phủ cả dòng tiêu đề và dòng sản phẩm
             .lineWidth(1.5)
             .stroke();
          
          // Đường viền bên phải của bảng (cho cả tiêu đề và dòng sản phẩm)
          doc.moveTo(50 + columnWidths.reduce((acc, width) => acc + width, 0), tableTop - 5)
             .lineTo(50 + columnWidths.reduce((acc, width) => acc + width, 0), tableTop + 35)
             .lineWidth(1.5)
             .stroke();
          
          // Vẽ đường viền hai bên của tiêu đề
          columnWidths.reduce((acc, width) => {
            doc.moveTo(acc, tableTop - 5)
               .lineTo(acc, tableTop + 15)
               .lineWidth(1.5)
               .stroke();
            return acc + Number(width);
          }, 50);
          
          // Thiết lập vị trí dòng đầu tiên của nội dung bảng
          let yPosition = tableTop + 20;
          let totalAmount = 0;
          let totalShipping = 0;
          
          doc.font('Arial').fontSize(10);
          
          // Lặp qua dữ liệu đơn hàng để vẽ các dòng nội dung
          orderDetails.forEach((detail) => {
            xPosition = 50;
          
            // Tính giá từng sản phẩm
            const unitPrice = detail.totalAmount / detail.quantityDetails;
            totalAmount += detail.totalAmount;
            totalShipping += detail.shippingFee;
          
            // Dữ liệu cho từng dòng (sản phẩm)
            const rowData = [
              detail.nameProduct,
              detail.quantityDetails.toString(),
              orderAndDetailControler.formatCurrency(unitPrice),
              orderAndDetailControler.formatCurrency(detail.shippingFee),
              orderAndDetailControler.formatCurrency(detail.totalPriceWithShipping)
            ];
          
            // Hiển thị dữ liệu trong từng cột và vẽ đường viền giữa các cột
            rowData.forEach((text, i) => {
              const isText = i === 0; // Cột chữ (sản phẩm) hoặc số
              const padding = isText ? 5 : -5; // Cách một khoảng nhỏ về bên trái với chữ và bên phải với số
              doc.text(text, xPosition + padding, yPosition, {
                width: columnWidths[i],
                align: isText ? 'left' : 'right'
              });
          
              // Vẽ đường viền dọc giữa các cột
              if (i < rowData.length - 1) { // Tránh vẽ đường cuối cùng ngoài cùng bên phải
                doc.moveTo(xPosition + columnWidths[i], yPosition - 5)
                   .lineTo(xPosition + columnWidths[i], yPosition + 15)
                   .stroke();
              }
          
              xPosition += columnWidths[i];
            });
          
            // Vẽ đường ngang dưới mỗi hàng
            doc.moveTo(50, yPosition + 15)
               .lineTo(50 + columnWidths.reduce((acc, width) => acc + width, 0), yPosition + 15)
               .stroke();
          
            // Di chuyển vị trí dòng tiếp theo xuống
            yPosition += 20;
          });
          
      
          // Add summary
          doc.moveDown(2);
          const summaryX = 350;
          const summaryData = [
            { label: 'Tổng tiền hàng:', value: orderAndDetailControler.formatCurrency(totalAmount) },
            { label: 'Phí vận chuyển:', value: orderAndDetailControler.formatCurrency(totalShipping) },
            { label: 'Tổng thanh toán:', value: orderAndDetailControler.formatCurrency(totalAmount + totalShipping) }
          ];
      
          doc.font('Arial-Bold');
          summaryData.forEach(item => {
            doc.text(item.label, summaryX, doc.y, { width: 100, align: 'right' })
               .text(item.value, summaryX + 100, doc.y - doc.currentLineHeight(), { align: 'right' });
          });
      
          // Add footer
          doc.moveDown(2)
             .fontSize(8)
             .font('Arial')
             .text('Cảm ơn quý khách!', { align: 'center' })
             .text('Vui lòng giữ hóa đơn này để đối chiếu khi cần thiết.', { align: 'center' });
      
          doc.end();
        } catch (error) {
          console.error('Error generating invoice PDF:', error);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Failed to generate invoice PDF',
              details: error.message
            });
          }
        }
      },

      exportInvoiceToExcel: async (req, res) => {
        try {
          const { orderId } = req.params;
   
          
          const order = await OrderAuction.findOne({
            _id: orderId,
            status: 'active'
          }).populate('shippingAddress.userID', 'recipientName phoneNumber address');
   
          const orderDetails = await OrderDetailAuction.find({
            order: orderId,
            status: 'active'
          }).lean();
      
          if (!order || !orderDetails.length) {
            throw new Error('Order not found or has no details');
          }
      
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Invoice');
      
          // Định nghĩa các cột
          worksheet.columns = [
            { header: 'Sản phẩm', key: 'nameProduct', width: 30 },
            { header: 'Số lượng', key: 'quantity', width: 10 },
            { header: 'Đơn giá', key: 'unitPrice', width: 15 },
            { header: 'Phí ship', key: 'shippingFee', width: 15 },
            { header: 'Tổng tiền', key: 'totalPriceWithShipping', width: 20 }
          ];
      
          // Tiêu đề hóa đơn
          worksheet.mergeCells('A1:E1');
          const titleCell = worksheet.getCell('A1');
          titleCell.value = 'HÓA ĐƠN ĐẤU GIÁ';
          titleCell.font = { bold: true, size: 16 };
          titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      
          // Thông tin hóa đơn
          worksheet.addRow([]);
          worksheet.addRow([`Mã hóa đơn: INV-${orderId.slice(-6)}`]).font = { bold: true };
          worksheet.addRow([`Ngày đặt hàng: ${moment(order.order_date).format('DD/MM/YYYY')}`]).font = { bold: true };
          worksheet.addRow([]);
      
          // Thông tin giao hàng
          const shippingTitle = worksheet.addRow(['THÔNG TIN GIAO HÀNG']);
          shippingTitle.font = { bold: true, size: 12 };
          
          worksheet.addRow([`Người nhận: ${order.shippingAddress.recipientName}`]);
          worksheet.addRow([`Số điện thoại: ${order.shippingAddress.phoneNumber}`]);
          worksheet.addRow([`Địa chỉ: ${order.shippingAddress.address}`]);
          worksheet.addRow([]);
      
          // Thông tin thanh toán
          const paymentTitle = worksheet.addRow(['THÔNG TIN THANH TOÁN']);
          paymentTitle.font = { bold: true, size: 12 };
          
          worksheet.addRow([`Phương thức thanh toán: ${orderDetails[0].payment_method || 'N/A'}`]);
          worksheet.addRow([`Hình thức vận chuyển: ${orderDetails[0].formatShipping?.type || 'Tiêu chuẩn'}`]);
          worksheet.addRow([]);
      
          // Thêm bảng sản phẩm
          const headerRow = worksheet.addRow(['Sản phẩm', 'Số lượng', 'Đơn giá', 'Phí ship', 'Tổng tiền']);
          
          // Style cho header của bảng
          headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
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
              orderAndDetailControler.formatCurrency(detail.totalPriceWithShipping)
            ]);
      
            // Thêm border cho mỗi cell trong row
            detailRow.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
              cell.alignment = { vertical: 'middle' };
            });
      
            // Căn giữa cột số lượng
            detailRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
            
            // Căn phải các cột giá
            [3, 4, 5].forEach(colIndex => {
              detailRow.getCell(colIndex).alignment = { horizontal: 'right', vertical: 'middle' };
            });
          });
      
          // Thêm tổng kết
          worksheet.addRow([]);
          
          const summaryRows = [
            ['', '', 'Tổng tiền hàng:', '', orderAndDetailControler.formatCurrency(totalAmount)],
            ['', '', 'Phí vận chuyển:', '', orderAndDetailControler.formatCurrency(totalShipping)],
            ['', '', 'Tổng thanh toán:', '', orderAndDetailControler.formatCurrency(totalAmount + totalShipping)]
          ];
      
          summaryRows.forEach(rowData => {
            const row = worksheet.addRow(rowData);
            row.getCell(3).font = { bold: true };
            row.getCell(5).font = { bold: true };
            row.getCell(5).alignment = { horizontal: 'right' };
          });
      
          // Gửi file
          res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=Invoice_${orderId}_${moment().format('YYYYMMDD')}.xlsx`
          );
      
          await workbook.xlsx.write(res);
          res.end();
      
        } catch (error) {
          console.error('Error generating invoice Excel:', error);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Failed to generate invoice Excel',
              details: error.message
            });
          }
        }
      },
      formatCurrency : (amount) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(amount);
      }
}



module.exports = orderAndDetailControler