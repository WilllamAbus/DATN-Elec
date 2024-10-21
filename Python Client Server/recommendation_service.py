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

# Function to generate item-based recommendations
def item_based_recommendation(user_item_matrix, user_id):
    interacted_products = user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] > 0].index
    product_similarity_df = pd.DataFrame(
        cosine_similarity(user_item_matrix.T),
        index=user_item_matrix.columns,
        columns=user_item_matrix.columns
    )
    
    recommended_items = set()
    for product in interacted_products:
        similar_items = product_similarity_df[product].sort_values(ascending=False)[1:3]  # Top 2 similar products
        recommended_items.update(similar_items.index.tolist())
    
    return list(recommended_items)

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

# Function to recommend products for a user
def recommend_products_for_user(user_id):
    interactions_df = get_interactions(user_id)
    if interactions_df is None:
        return []

    user_item_matrix = create_user_item_matrix(interactions_df)
    recommended_items = item_based_recommendation(user_item_matrix, user_id)
    
    if not recommended_items:
        print("No products to recommend.")
        return []
    
    recommended_products = get_product_details(recommended_items)
    save_recommendation(user_id, recommended_products, interactions_df.to_dict('records')) 
    return recommended_products

# Function to save recommendations to the database
def save_recommendation(user_id, recommended_products, interactions):
    try:
        recommendation = {
            "user": ObjectId(user_id),
            "recommendedItems": [
                {"item": ObjectId(product["productID"]), "score": 0.8} for product in recommended_products
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
        recommendation_collection.insert_one(recommendation)
        print("Recommendation saved successfully.")
    except Exception as e:
        print(f"Error saving recommendation: {str(e)}")

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
