import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
import sys

# Load environment variables from .env file
load_dotenv()

# Get environment variables
MONGODB_URI = os.getenv('MONGODB_URI')

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client['BeReacts']
order_cart_collection = db["OrderCart"]
order_detail_collection = db["OrderDetail"]
interaction_collection = db["interaction"]
recommendation_collection = db["recommendation"]
user_id = sys.argv[1] 

def get_product_variants(user_id):
    """
    Retrieve product variants associated with a user from OrderCart, Interaction, or productAuction.
    """
    product_variants = set()  # Use a set to avoid duplicates

    # Check OrderCart and retrieve productVariant from OrderDetails
    order_cart = order_cart_collection.find_one({"user": ObjectId(user_id)})
    if order_cart:
        order_detail_ids = order_cart.get("cartDetails", [])
        if order_detail_ids:
            order_details = order_detail_collection.find({"_id": {"$in": order_detail_ids}}, {"items.productVariant": 1})
            for detail in order_details:
                for item in detail.get("items", []):
                    product_variant = item.get("productVariant")
                    if product_variant:
                        product_variants.add(str(product_variant))  # Convert ObjectId to string

    # Check Interaction and retrieve productVariant or productAuction
    interactions = interaction_collection.find({"user": ObjectId(user_id)})
    print(interactions[:10]) 
    for interaction in interactions:
        if "productVariant" in interaction:
            product_variants.add(str(interaction["productVariant"]))
        elif "productAuction" in interaction:
            product_variants.add(str(interaction["productAuction"]))

    return list(product_variants)  # Return as a list

def create_item_product_matrix():
    """
    Create a user-product interaction matrix from Interaction collection.
    """
    interactions = list(interaction_collection.find())
    if not interactions:
        print("No data found in Interaction collection.")
        return None

    df = pd.DataFrame(interactions)
    required_columns = ['user', 'productVariant', 'productAuction', 'score']
    for col in required_columns:
        if col not in df.columns:
            df[col] = None

    # Select necessary columns and handle missing values in productVariant and productAuction
    df['user'] = df['user'].astype(str)
    df['productID'] = df['productVariant'].fillna(df['productAuction'])

    # Filter to necessary columns and pivot into user-product matrix
    user_product_matrix = df.pivot_table(index='user', columns='productID', values='score', fill_value=0)
    return user_product_matrix

def compute_item_similarity(user_product_matrix):
    """
    Compute cosine similarity between products.
    """
    similarity_matrix = cosine_similarity(user_product_matrix.T)
    similarity_df = pd.DataFrame(similarity_matrix, index=user_product_matrix.columns, columns=user_product_matrix.columns)
    return similarity_df

def get_recommendations(user_product_matrix, similarity_matrix, user_id):
    user_id_str = str(user_id)
    if user_id_str not in user_product_matrix.index:
        print(f"User {user_id} not found in user-product matrix.")
        return []

    user_interactions = user_product_matrix.loc[user_id_str]
    
    recommendations = []
    
    # Tính toán điểm dựa trên các sản phẩm tương tự và những sản phẩm đã người dùng tương tác
    for product in user_product_matrix.columns:
        if user_interactions[product] == 0:  # Chỉ gợi ý sản phẩm chưa được tương tác
            similar_scores = similarity_matrix[product]
            print(f"Product: {product}, Similar scores: {similar_scores}, User interactions: {user_interactions}")
            
            # Tính điểm trung bình của các sản phẩm tương tự chưa được người dùng tương tác
            weighted_score = sum(similar_scores * user_interactions) / (sum(similar_scores) + 1e-6)  # tránh chia cho 0
            print(f"Weighted score: {weighted_score}")
            recommendations.append((product, weighted_score))  # Thêm cả sản phẩm và điểm vào danh sách

    # Sắp xếp các sản phẩm theo điểm gợi ý giảm dần
    recommended_products = sorted(recommendations, key=lambda x: x[1], reverse=True)
    return recommended_products  # Trả về danh sách các tuple (product, score)

def save_recommendation(user_id, recommended_items, algorithm="collaborative_filtering"):
    """
    Save the generated recommendations to the 'recommendation' collection.
    """
    recommendation_data = {
        "user": ObjectId(user_id),
        "recommendedItems": [{"item": item, "score": score} for item, score in recommended_items],
        "algorithm": algorithm,
        "generatedAt": datetime.now(),
        "expiresAt": None,
        "stateRecommendation": "pending",
        "status": "active"
    }
    result = recommendation_collection.insert_one(recommendation_data)
    return recommendation_data

def main():
    # Fetch product variants for user
    product_variants = get_product_variants(user_id)
    print(f"Product variants for User {user_id}: {product_variants}")
    
    # Create user-product matrix
    user_product_matrix = create_item_product_matrix()
    if user_product_matrix is None:
        print("Failed to create user-product matrix.")
        return
    print(user_product_matrix.head()) 
    # Compute item similarity matrix
    similarity_matrix = compute_item_similarity(user_product_matrix)

    # Generate recommendations
    recommendations = get_recommendations(user_product_matrix, similarity_matrix, user_id)

    print(f"Recommended products for User {user_id}: {recommendations}")

    # Save recommendations to database if available
    if recommendations:
        saved_recommendation = save_recommendation(user_id, recommendations)
        print(f"Recommendation saved: {saved_recommendation}")
    else:
        print(f"No recommendations to save for user {user_id}.")

if __name__ == "__main__":
    main()

