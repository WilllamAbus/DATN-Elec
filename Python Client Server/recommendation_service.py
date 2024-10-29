import os
import sys
import pandas as pd
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

# Get environment variables
MONGODB_URI = os.getenv('MONGODB_URI')
URL_FE = os.getenv('URL_FE')
PORT = os.getenv('PORT')

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client['BeReacts']  # Database
interaction_collection = db['interaction']  # Interaction collection
product_collection = db['product_v2']  # Product collection
recommendation_collection = db['recommendation']  # Recommendation collection

# Function to get interactions of a user
def get_interactions(user_id):
    try:
        interactions = list(interaction_collection.find({
            'user': ObjectId(user_id),
            'productID': {'$ne': None}
        }))
        if interactions:
            return pd.DataFrame(interactions)
        else:
            print(f"No interactions found for user_id: {user_id}")
            return None
    except Exception as e:
        print(f"Error fetching interactions: {str(e)}")
        return None

# Function to create a user-item matrix
def create_user_item_matrix(interactions_df):
    interactions_df['user'] = interactions_df['user'].astype(str)
    return interactions_df.pivot_table(index='user', columns='productID', values='score', fill_value=0)

# Hàm tạo gợi ý dựa trên sự tương đồng giữa các sản phẩm (item-based recommendation)
def item_based_recommendation(user_item_matrix, user_id):
    # Lấy danh sách các sản phẩm mà người dùng đã tương tác (sản phẩm có điểm số > 0)
    interacted_products = user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] > 0].index

    # Tính toán độ tương đồng giữa các sản phẩm bằng cosine similarity
    product_similarity_df = pd.DataFrame(
        cosine_similarity(user_item_matrix.T),  # Chuyển ma trận và tính toán tương đồng
        index=user_item_matrix.columns,  # Đặt index là productID
        columns=user_item_matrix.columns  # Đặt cột là productID
    )
    
    recommended_items = {}  # Tạo từ điển để lưu các sản phẩm được gợi ý và điểm tương đồng
    for product in interacted_products:
        # Lấy các sản phẩm tương tự nhất với sản phẩm hiện tại (bỏ qua chính sản phẩm đó)
        similar_items = product_similarity_df[product].sort_values(ascending=False)[1:3]  # Chỉ lấy 2 sản phẩm tương tự
        for item, similarity in similar_items.items():
            if item not in recommended_items:
                recommended_items[item] = similarity  # Lưu sản phẩm và điểm tương đồng
    
    return recommended_items  # Trả về từ điển sản phẩm gợi ý và điểm tương đồng


# Function to get product details from the database
def get_product_details(product_ids):
    products = []
    for product_id in product_ids:
        try:
            product = product_collection.find_one({"_id": ObjectId(product_id)})
            if product:
                products.append({
                    "name": product.get('product_name', 'Unknown'),
                    "price": product.get('product_price', 0),
                    "image": product.get('image', ['no_image.jpg']),
                    "productID": str(product["_id"])
                })
            else:
                print(f"Product with ID {product_id} not found.")
        except Exception as e:
            print(f"Error fetching product with ID {product_id}: {str(e)}")
    return products

# Hàm gợi ý sản phẩm cho người dùng dựa trên tương tác của họ
def recommend_products_for_user(user_id):
    interactions_df = get_interactions(user_id)  # Lấy dữ liệu tương tác của người dùng
    if interactions_df is None:
        return []

    user_item_matrix = create_user_item_matrix(interactions_df)  # Tạo ma trận user-item

    recommended_items = item_based_recommendation(user_item_matrix, user_id)  # Tạo gợi ý dựa trên sản phẩm

    if not recommended_items:
        print("Không có sản phẩm nào để gợi ý.")
        return []
    
    recommended_products = get_product_details(recommended_items.keys())  # Lấy chi tiết các sản phẩm được gợi ý
    # Thêm điểm số (similarity score) cho các sản phẩm gợi ý
    for product in recommended_products:
        product['score'] = recommended_items[product['productID']]
    
    save_recommendation(user_id, recommended_products, interactions_df.to_dict('records'))  # Lưu gợi ý vào CSDL
    return recommended_products


# Hàm lưu gợi ý vào CSDL (model recommendation)
def save_recommendation(user_id, recommended_products, interactions):
    try:
        # Tạo đối tượng recommendation để lưu vào CSDL
        recommendation = {
            "user": ObjectId(user_id),
            "recommendedItems": [
                {"item": ObjectId(product["productID"]), "score": product["score"]} for product in recommended_products
            ],  # Lưu sản phẩm gợi ý và điểm score (từ cosine similarity)
            "interactions": [ObjectId(interaction['_id']) for interaction in interactions],  # Lưu các tương tác đã xảy ra
            "algorithm": "collaborative_filtering",  # Thuật toán gợi ý sử dụng
            "generatedAt": datetime.now(),  # Thời gian tạo gợi ý
            "expiresAt": datetime.now() + timedelta(days=7),  # Thời gian hết hạn của gợi ý (sau 7 ngày)
            "stateRecommendation": "pending",  # Trạng thái gợi ý ban đầu là "chờ"
            "modifieon": datetime.now(),
            "status": "active",  # Trạng thái gợi ý
            "disabledAt": None
        }
        # Lưu vào collection 'recommendation'
        recommendation_collection.insert_one(recommendation)
        print("Lưu gợi ý thành công.")
    except Exception as e:
        print(f"Lỗi khi lưu gợi ý vào CSDL: {str(e)}")
# Main function to run the script
if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        recommendations = recommend_products_for_user(user_id)
        
        if recommendations:
            print("Recommended products:")
            for product in recommendations:
                print(f"- {product['name']} | Price: {product['price']} | Image: {product['image']} | ID: {product['productID']}")
        else:
            print("No recommendations available.")
    else:
        print("Please provide a user_id.")
