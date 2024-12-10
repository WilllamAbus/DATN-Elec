import axios from "axios";
import { RelatedProductsResponse } from "../product_v2/client/types/homeAllProduct";

export const fetchRelatedProducts = async (productSlug: string): Promise<RelatedProductsResponse> => {
    try {
        // Gọi API của Flask server với slug được truyền vào
        const response = await axios.get<RelatedProductsResponse>(`http://localhost:1111/recom/${productSlug}`);
        console.log('Related', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching related products:', error);
        throw error;
    }
};
