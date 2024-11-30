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
order_auction_collection = db["orderAuctions"]
order_detail_auction_collection = db["orderDetailAuction"]
user_id = sys.argv[1]

def get_product_variants(user_id):
    """
    Retrieve product variants associated with a user from OrderCart and OrderAuctions.
    """
    product_variants = set()
    product_auctions = set()  # Khởi tạo biến để lưu productID từ đấu giá
    
    # Fetch all interactions for the user
    interactions = interaction_collection.find({"user": ObjectId(user_id)})

    # Check if there is an OrderCart for the user
    order_cart = order_cart_collection.find_one({"user": ObjectId(user_id)})
    if order_cart:
        order_detail_ids = order_cart.get("cartDetails", [])
        if order_detail_ids:
            order_details = order_detail_collection.find(
                {"_id": {"$in": order_detail_ids}},
                {"items.productVariant": 1}
            )
            for detail in order_details:
                for item in detail.get("items", []):
                    product_variant = item.get("productVariant")
                    if product_variant:
                        product_variants.add(str(product_variant))

    # Check if there are any productVariants in interactions
    for interaction in interactions:
        if "productVariant" in interaction:
            product_variants.add(str(interaction["productVariant"]))

    # Check if there are any OrderAuctions for the user
    order_auctions = order_auction_collection.find({"user": ObjectId(user_id)})
    for auction in order_auctions:
        order_detail_ids = auction.get("auctionDetails", [])
        if order_detail_ids:
            order_detail_auctions = order_detail_auction_collection.find(
                {"_id": {"$in": order_detail_ids}},
                {"items.productID": 1}
            )
            for auction_detail in order_detail_auctions:
                for item in auction_detail.get("items", []):
                    product_id = item.get("productID")
                    if product_id:
                        product_auctions.add(str(product_id))  # Lưu productID vào product_auctions

    # Kết hợp product_variants từ cả hai nguồn
    product_variants.update(product_auctions)  # Thêm productID từ đấu giá vào product_variants
    
    print(f"Product Variants and Auction Products: {product_variants}")
    return list(product_variants)

def create_user_product_matrix():
    """
    Create a user-product interaction matrix from the Interaction collection.
    """
    interactions = list(interaction_collection.find())
    if not interactions:
        print("No data found in Interaction collection.")
        return None

    # Convert the interactions data into a DataFrame
    df = pd.DataFrame(interactions)

    # Ensure necessary columns exist
    required_columns = ['user', 'productVariant', 'productAuction', 'score']
    for col in required_columns:
        if col not in df.columns:
            df[col] = None

    df['user'] = df['user'].astype(str)
    
    # Create a productID column combining productVariant and productAuction
    df['productID'] = df['productVariant'].fillna("Auction:" + df['productAuction'].astype(str))

    # Drop rows where productID is NaN
    df = df[df['productID'].notna()]

    # Create a user-product matrix (pivot table)
    user_product_matrix = df.pivot_table(index='user', columns='productID', values='score', fill_value=0)

    # Print user-product matrix
    print("User-Product Interaction Matrix:")
    print(user_product_matrix)
    
    return user_product_matrix

def compute_item_similarity(user_product_matrix):
    """
    Compute cosine similarity between products based on user interactions.

    Parameters:
    user_product_matrix (DataFrame): A matrix where rows represent users and columns represent products.

    Returns:
    DataFrame: A DataFrame containing cosine similarity scores between products.
    """
    if user_product_matrix is None or user_product_matrix.empty:
        print("The user-product matrix is empty or None.")
        return None

    # Compute cosine similarity between products
    similarity_matrix = cosine_similarity(user_product_matrix.T)

    # Convert the similarity matrix to a DataFrame
    similarity_df = pd.DataFrame(similarity_matrix, index=user_product_matrix.columns, columns=user_product_matrix.columns)

    # Print similarity matrix
    print("Product Similarity Matrix (Cosine Similarity):")
    print(similarity_df)
    
    return similarity_df

def get_recommendations(user_product_matrix, similarity_matrix, user_id, bias=0.1):
    """
    Generate product recommendations for a user based on similarity scores.

    Parameters:
    user_product_matrix (DataFrame): A matrix where rows represent users and columns represent products.
    similarity_matrix (DataFrame): A matrix of product similarity scores.
    user_id (str): The ID of the user for whom recommendations are generated.
    bias (float): A bias added to the recommendation score.

    Returns:
    list: A list of recommended products with their scores.
    """
    user_id_str = str(user_id)
    if user_id_str not in user_product_matrix.index:
        print(f"User {user_id} not found in user-product matrix.")
        return []

    user_interactions = user_product_matrix.loc[user_id_str]
    recommendations = []

    # Compute recommendation scores for products not interacted with by the user
    for product in user_product_matrix.columns:
        if user_interactions[product] == 0:  # Recommend only products the user hasn't interacted with
            similar_scores = similarity_matrix[product]
            weighted_score = (sum(similar_scores * user_interactions) + bias) / (sum(similar_scores) + 1e-6)

            product_str = str(product)

            if product_str.startswith("Auction:"):
                # Handle auction product IDs
                product_type = "productAuction"
                product_id = product_str.replace("Auction:", "")
                # Skip invalid product IDs like 'nan'
                if product_id.lower() == 'nan' or not product_id.strip():
                    continue
                recommendations.append((product_id, weighted_score, product_type))
            else:
                # Handle regular productVariant IDs
                product_type = "productVariant"
                if product_str.lower() == 'nan' or not product_str.strip():
                    continue
                try:
                    product_id = ObjectId(product_str)
                    recommendations.append((product_id, weighted_score, product_type))
                except Exception as e:
                    print(f"Skipping invalid product ID: {product_str} (Error: {e})")

    # Sort products by recommendation score in descending order
    recommended_products = sorted(recommendations, key=lambda x: x[1], reverse=True)

    return recommended_products

def save_recommendation(user_id, recommended_items, algorithm="collaborative_filtering"):
    """
    Save the generated recommendations to the 'recommendation' collection.
    
    Parameters:
    user_id (str): The ID of the user.
    recommended_items (list): A list of recommended items.
    algorithm (str): The algorithm used for generating recommendations.
    
    Returns:
    dict: The saved recommendation data.
    """
    recommendation_data = {
        "user": ObjectId(user_id),
        "recommendedItems": [
            {
                "item": item,
                "itemType": product_type,
                "score": score,
            }
            for item, score, product_type in recommended_items
        ],
        "algorithm": algorithm,
        "generatedAt": datetime.now(),
        "expiresAt": None,
        "stateRecommendation": "pending",
        "status": "active",
    }

    # Insert the recommendation data into the database
    result = recommendation_collection.insert_one(recommendation_data)
    print(f"Saved recommendation ID: {result.inserted_id}")
    return recommendation_data

def main(user_id):
    """
    Main function to generate and save product recommendations for a user.
    
    Parameters:
    user_id (str): The ID of the user for whom recommendations are generated.
    """
    user_product_matrix = create_user_product_matrix()  # Assume this function is defined
    if user_product_matrix is None:
        print("Failed to create user-product matrix.")
        return

    # Compute the item similarity matrix
    similarity_matrix = compute_item_similarity(user_product_matrix)  # Assume this function is defined
    if similarity_matrix is None:
        print("Failed to compute item similarity matrix.")
        return

    # Generate product recommendations
    recommendations = get_recommendations(user_product_matrix, similarity_matrix, user_id)

    print(f"Recommended products for User {user_id}: {recommendations}")

    # Save recommendations to the database
    if recommendations:
        saved_recommendation = save_recommendation(user_id, recommendations)
        print(f"Recommendation saved: {saved_recommendation}")
    else:
        print(f"No recommendations to save for User {user_id}.")

if __name__ == "__main__":
    main(user_id)
