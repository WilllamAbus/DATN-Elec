import instance from "../axios";
const API_URL = "http://localhost:4000/api/interaction";

export interface Instance {
    user:string | undefined ;
    orderAuctions:string | null;
    item:string;
    OrderCart:string | null;
    Watchlist:string | null;
    productID: string;
    type: string;
    score:number;
}

export const addInteraction = async ( interactionData: Instance) => {
  try {
    const response = await instance.post(`${API_URL}/interactions`, interactionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error: any) {
   return console.log('Error adding interaction:', error.response?.data || error.message);
  }
};
export const addInteractionView = async (interactionData : Instance) => {
  try {
    const response = await instance.post(`${API_URL}/interactions-view`, interactionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error: any) {
  return error;
  }
};
export const addInteractionAuction = async (
  interactionData: Instance) => {
  try {
    const response = await instance.post(`${API_URL}/auctions`, interactionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error: any) {
    return  console.log('Error adding interaction:', error.response?.data || error.message);
  }
};



  
  
  
  