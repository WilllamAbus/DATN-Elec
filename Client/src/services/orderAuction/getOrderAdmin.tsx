import axios from '../axios';
// import { Order } from '../../types/adminOrder/orderAll';
import { OrderDetailAdminResponse} from '../../types/adminOrder/orderDetailAdmin';




export const getAllOrders = async (page: number, search: string,  ) => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    // Append the search parameter if provided
    if (search) {
      queryParams.append("search", search);
    }

    const response = await axios.get('/client/orderAuc/getAll', {
      params: queryParams,
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