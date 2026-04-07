import axios from "axios";
import { RelatedProductsResponse } from "../product_v2/client/types/homeAllProduct";
import {RelatedProductsAuctionResponse} from "./types/relatedProductAuction";
const BASE_URL = "http://localhost:1111"; 

export const fetchRelatedProducts = async (productSlug: string): Promise<RelatedProductsResponse> => {
    try {
        // Gọi API của Flask server với slug được truyền vào
        const response = await axios.get<RelatedProductsResponse>(`${BASE_URL}/variant-recom/${productSlug}`);
        console.log('Related', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching related products:', error);
        throw error;
    }
};

export const fetchRelatedProductAuctions = async (productSlug: string): Promise<RelatedProductsAuctionResponse> => {
    try {
        const response = await axios.get<RelatedProductsAuctionResponse>(`${BASE_URL}/auction-recom/${productSlug}`);
        console.log("Related auction", response.data);
        return response.data; // Trả về đối tượng với trường "Sản phẩm gợi ý"
    } catch (error) {
        console.error("Error fetching related product auctions:", error);
        throw error;
    }
}


