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

print(f"URL_FE: {URL_FE}")
print(f"Cổng: {PORT}")
print(f"URI MongoDB: {MONGODB_URI}")

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client['BeReacts'] 
interaction_collection = db['interaction']  
product_collection = db['product_v2']  

def get_interactions(user_id):
    try:
        interactions = list(interaction_collection.find({
            'user': ObjectId(user_id),
            'productID': {'$ne': None}
        }))
        if interactions:
            df = pd.DataFrame(interactions)
            print("Dữ liệu tương tác:", df)  
            return df
        else:
            print(f"Không tìm thấy tương tác cho user_id: {user_id}")
            return None
    except Exception as e:
        print(f"Lỗi khi lấy tương tác: {str(e)}")
        return None

def create_user_item_matrix(interactions_df):
    interactions_df['user'] = interactions_df['user'].astype(str)
    user_item_matrix = interactions_df.pivot_table(
        index='user', columns='productID', values='score', fill_value=0
    )
    return user_item_matrix
def item_based_recommendation(user_item_matrix, user_id):
    # Get the products that the user has interacted with (actual product IDs, not indices)
    interacted_products = user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] > 0].index

    product_similarity_df = pd.DataFrame(
        cosine_similarity(user_item_matrix.T),
        index=user_item_matrix.columns,
        columns=user_item_matrix.columns
    )

    recommended_items = set()
    for product in interacted_products:
        similar_items = product_similarity_df[product].sort_values(ascending=False)[1:3]  # Skip the first, as it's the same product
        recommended_items.update(similar_items.index.tolist())
    
    return list(recommended_items)

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
                print(f"Sản phẩm với ID {product_id} không tìm thấy.")
        except Exception as e:
            print(f"Lỗi khi lấy sản phẩm với ID {product_id}: {str(e)}")
    return products

def recommend_products_for_user(user_id):
    interactions_df = get_interactions(user_id)
    if interactions_df is None:
        return []

    user_item_matrix = create_user_item_matrix(interactions_df)

    recommended_items = item_based_recommendation(user_item_matrix, user_id)
    
    if not recommended_items:
        print("Không có sản phẩm được đề xuất.")
        return []
    
    recommended_product_ids = [item for item in recommended_items]
    recommended_products = get_product_details(recommended_product_ids)

    save_recommendation(user_id, recommended_products, interactions_df.to_dict('records')) 

    return recommended_products

def save_recommendation(user_id, recommended_products, interactions):
    try:
        recommendation = {
            "user": ObjectId(user_id),
            "recommendedItems": [
                {
                    "item": ObjectId(product["productID"]),
                    "score": 0.8  
                } for product in recommended_products
            ],
            "interactions": [ObjectId(interaction['_id']) for interaction in interactions],  
            "algorithm": "collaborative_filtering",
            "generatedAt": datetime.now(),
            "expiresAt": datetime.now() + timedelta(days=7),
            "stateRecommendation": "pending",
            "modifieon": datetime.now(),
            "status": "active",
            "disabledAt": None
        }
        db["recommendation"].insert_one(recommendation)
        print("Đã lưu dữ liệu vào model recommendation")
    except Exception as e:
        print(f"Lỗi khi lưu dữ liệu vào model recommendation: {str(e)}")

# Main function to run the script with a user_id
if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        recommendations = recommend_products_for_user(user_id)
        
        if recommendations:
            print("Sản phẩm được đề xuất:")
            for product in recommendations:
                print(f"- {product['name']} | Giá: {product['price']} | Hình ảnh: {product['image']} | ID: {product['productID']}")
        else:
            print("Không có sản phẩm được đề xuất.")
    else:
        print("Vui lòng cung cấp user_id.")
