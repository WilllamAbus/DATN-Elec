import axios from '../axios';
// import { Order } from '../../types/adminOrder/orderAll';
import { OrderDetailAdminResponse} from '../../types/adminOrder/orderDetailAdmin';
import { OrderResponse} from '../../types/adminOrder/orderAll';
// import  { AxiosResponse } from 'axios';
// import {Order} from '../../types/adminOrder/orderUpdateStatus';

export const getAllOrders = async (page: number, pageSize: number, search: string = '' ) => {
  try {
 

    const response = await axios.get<OrderResponse>('/client/orderAuc/getAll', {
      params: {
        page,
        pageSize,
        search,
      },
    });

    
    return response.data; // Kết quả từ API
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Error fetching orders');
  }
};





// Function takes userId as an argument and passes it in the request as a query parameter
export const fetchOrderDetailAdminData = async (orderId: string): Promise<OrderDetailAdminResponse> => {
  const response = await axios.get(`client/orderAuc/orderDetailAdmin/${orderId}`, {
 
  });


  
  return response.data;
};



export const updateOrderStatus = async (orderId: string, stateOrder: string) => {
  const response = await axios.put(`/client/iteracOder/updateStatus/${orderId}`, { stateOrder });

  
  return response.data; // Return the order data
};

export const updateOrderStatusCash = async (orderIdCash: string, stateOrderCash: string) => {
  const response = await axios.put(`/client/iteracOder/updateStatusCash/${orderIdCash}`, { stateOrderCash });

  
  return response.data; // Return the order data
};
export const downloadInvoiceExcelCash = async (orderId: string) => {
  try {
    // Gọi API với `responseType: 'blob'` để nhận file dưới dạng blob
    const response = await axios.get(`client/iteracOder/invoicesExecl/${orderId}`, {
      responseType: 'blob', // Đảm bảo nhận dữ liệu dưới dạng blob
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Chỉ định khi tải file Excel
      },
    });

    // Xử lý file nhận được và tạo URL blob để tải xuống
    const url = window.URL.createObjectURL(new Blob([response.data]));

    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${orderId}.xlsx`);
    document.body.appendChild(link);
    
    // Log link element trước khi click

    
    link.click();

    
    link.remove();

  } catch (error) {
    console.error('Failed to download Excel file:', error);
    throw error;
  }
};

export const getInvoicePDFCash = async (orderId: string) => {
  try {
    const response = await axios.get(`client/iteracOder/invoices/${orderId}`, {
      responseType: 'blob', // Important for handling PDFs
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading invoice:', error);
  }
};


export const downloadInvoiceExcel = async (orderId: string) => {
  try {
    // Gọi API với `responseType: 'blob'` để nhận file dưới dạng blob
    const response = await axios.get(`client/orderAuc/invoicesExecl/${orderId}`, {
      responseType: 'blob', // Đảm bảo nhận dữ liệu dưới dạng blob
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Chỉ định khi tải file Excel
      },
    });

    // Xử lý file nhận được và tạo URL blob để tải xuống
    const url = window.URL.createObjectURL(new Blob([response.data]));

    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${orderId}.xlsx`);
    document.body.appendChild(link);
    
    // Log link element trước khi click

    
    link.click();

    
    link.remove();

  } catch (error) {
    console.error('Failed to download Excel file:', error);
    throw error;
  }
};


export const getInvoicePDF = async (orderId: string) => {
  try {
    const response = await axios.get(`client/orderAuc/invoices/${orderId}`, {
      responseType: 'blob', // Important for handling PDFs
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading invoice:', error);
  }
};