export interface TimeTrack {
    _id: string;
    startTime?: Date;
    endTime?: Date;
    endTimeBid?: Date;
    // Add any other fields that are part of your TimeTrack model
  }

export interface EditTimeTrackData {
  productName?: string;
    productId?: string; // Added productId to the interface
    startTime?: string; // ISO string or datetime-local format from input
    endTime?: string;
    endTimeBid?: string;
}
    


  // src/types/timeTrackTypes.ts
export interface ProductDetails {
    _id: string;
    name: string;
    price: number;
  }
  
  export interface TimeTrackDataEdit {
    _id: string;
    product: ProductDetails;
    startTime: string;
    endTime: string;
    endTimeBid?: string; // Assuming this field might be optional
    status: 'active' | 'expired';
  }
  