import instance from "../axios";
import {RelatedProductsResponse} from "../product_v2/client/types/homeAllProduct";
export const fetchRelatedProducts = async (productId: string): Promise<RelatedProductsResponse> => {
    try {
        const response = await instance.get<RelatedProductsResponse>(`client/product/${productId}/related`);
        return response.data;
    } catch (error) {
        console.error('Error fetching related products:', error);
        throw error;
    }
};