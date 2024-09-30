import instance from "../axios";
const API_URL = "http://localhost:4000/api/interaction";

export interface Instance {
    user:string;
    orderAuctions:string | null;
    item:string;
    OrderCart:string | null;
    Watchlist:string | null;
    productID: string;
    type: string;
    score:number;
}

export const addInteraction = async (
  interactionData: {
    user: string;
    orderAuctions: string | null;
    item: string;
    OrderCart: string | null;
    productID: string;
    Watchlist: string | null;
    type: string;
    score: number;
  }
) => {
  try {
    const response = await instance.post(`${API_URL}/interactions`, interactionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error: any) {
    console.error('Error adding interaction:', error.response?.data || error.message);
    throw new Error(`Failed to add interaction: ${error.response?.data?.error || error.message}`);
  }
};
export const addInteractionView = async (
  interactionData: {
    user: string;
    orderAuctions: string | null;
    item: string;
    OrderCart: string | null;
    productID: string;
    Watchlist: string | null;
    type: string;
    score: number;
  }
) => {
  try {
    const response = await instance.post(`${API_URL}/interactions-view`, interactionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error: any) {
    console.error('Error adding interaction:', error.response?.data || error.message);
    throw new Error(`Failed to add interaction: ${error.response?.data?.error || error.message}`);
  }
};



  
  
  
  