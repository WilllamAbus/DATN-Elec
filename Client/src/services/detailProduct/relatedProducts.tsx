import instance from "../axios";
import {RelatedProductsResponse} from "../product_v2/client/types/homeAllProduct";

export const fetchRelatedProducts = async (productSlug: string): Promise<RelatedProductsResponse> => {
    try {
        const response = await instance.get<RelatedProductsResponse>(`client/product-detail/${productSlug}/related`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching related products:', error);
        throw error;
    }
};