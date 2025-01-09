export interface CheckAuctionTimeResponse {
  success: boolean;
  code: string;
  msg: string;
  status: number;
  error?: string;
  statusOutOfTime: boolean; 
  statuscheckAuctionTime: number; 
}
