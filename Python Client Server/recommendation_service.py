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

# Get user ID from command line arguments
if len(sys.argv) < 2:
    print("Please provide a user ID as a command line argument.")
    sys.exit(1)

user_id = sys.argv[1]  # User ID passed as an argument
print(f"Processing recommendations for User: {user_id}")


def get_product_variants(user_id):
    """
    Retrieve product variants associated with a user from OrderCart and Interaction collections.
    """
    product_variants = set()  # Use a set to avoid duplicates

    # Check OrderCart and retrieve productVariant from OrderDetails
    try:
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
                            product_variants.add(str(product_variant))  # Convert ObjectId to string
    except Exception as e:
        print(f"Error retrieving product variants from OrderCart: {e}")

    # Check Interaction and retrieve productVariant or productAuction
    try:
        interactions = interaction_collection.find({"user": ObjectId(user_id)})
        for interaction in interactions:
            if "productVariant" in interaction:
                product_variants.add(str(interaction["productVariant"]))
            elif "productAuction" in interaction:
                product_variants.add(str(interaction["productAuction"]))
    except Exception as e:
        print(f"Error retrieving interactions: {e}")

    return list(product_variants)  # Return as a list


def create_item_product_matrix():
    """
    Create a user-product interaction matrix from Interaction collection.
    """
    try:
        interactions = list(interaction_collection.find())
        if not interactions:
            print("No data found in Interaction collection.")
            return None

        # Convert interactions to DataFrame
        df = pd.DataFrame(interactions)

        # Create necessary columns if they don't exist
        required_columns = ['user', 'productVariant', 'productAuction', 'OrderCart', 'score']
        for col in required_columns:
            if col not in df.columns:
                df[col] = None

        # Convert 'user' to string
        df['user'] = df['user'].astype(str)

        # Process to get productVariant from OrderCart if it's missing
        def get_product_from_order_cart(order_cart_id):
            if order_cart_id:
                order_cart = order_cart_collection.find_one({'_id': order_cart_id})
                if order_cart and 'orderDetail' in order_cart:
                    return order_cart['orderDetail'].get('productVariant', None)
            return None

        # Fill missing productVariant with data from OrderCart if available
        df['productVariant'] = df['productVariant'].fillna(df.apply(lambda row: get_product_from_order_cart(row['OrderCart']), axis=1))

        # Prepare data for user-product matrix
        product_matrix_data = []

        # Loop through all interactions and get productVariant and productAuction
        for index, row in df.iterrows():
            if row['productVariant']:
                product_matrix_data.append([row['user'], row['productVariant'], row['score']])
            if row['productAuction']:
                product_matrix_data.append([row['user'], row['productAuction'], row['score']])

        # Convert data into DataFrame for easier pivoting
        matrix_df = pd.DataFrame(product_matrix_data, columns=['user', 'product', 'score'])

        # Create a user-product matrix using pivot_table
        user_product_matrix = matrix_df.pivot_table(index='user', columns='product', values='score', fill_value=        0)

        return user_product_matrix
    except Exception as e:
        print(f"Error creating user-product matrix: {e}")
        return None


def compute_item_similarity(user_product_matrix):
    """
    Compute cosine similarity between products.
    """
    try:
        similarity_matrix = cosine_similarity(user_product_matrix.T)
        similarity_df = pd.DataFrame(similarity_matrix, index=user_product_matrix.columns, columns=user_product_matrix.columns)
        return similarity_df
    except Exception as e:
        print(f"Error computing item similarity: {e}")
        return None


def get_recommendations(user_product_matrix, similarity_matrix, user_id):
    """
    Generate product recommendations for a user based on the similarity matrix.
    """
    user_id_str = str(user_id)
    if user_id_str not in user_product_matrix.index:
        print(f"User  {user_id} not found in user-product matrix.")
        return []

    user_interactions = user_product_matrix.loc[user_id_str]
    
    recommendations = []
    
    # Compute recommendation scores for products not interacted by the user
    for product in user_product_matrix.columns:
        if user_interactions[product] == 0:  # Recommend only products the user hasn't interacted with
            similar_scores = similarity_matrix[product]
            weighted_score = sum(similar_scores * user_interactions) / (sum(similar_scores) + 1e-6)
            recommendations.append((ObjectId(product), weighted_score))  # Use ObjectId

    # Sort products by recommendation score in descending order
    recommended_products = sorted(recommendations, key=lambda x: x[1], reverse=True)
    return recommended_products  # Return list of tuples (product, score)


def save_recommendation(user_id, recommended_items, algorithm="collaborative_filtering"):
    """
    Save the generated recommendations to the 'recommendation' collection.
    """
    try:
        # Fetch all interactions of the user
        interactions = interaction_collection.find({"user": ObjectId(user_id)})

        # Prepare recommended items with itemType and score
        formatted_recommendations = []
        for item, score in recommended_items:
            item_type = "productVariants" if str(item).startswith("672e") else "productAuction"
            formatted_recommendations.append({
                "item": ObjectId(item),  # Use ObjectId for MongoDB
                "itemType": item_type,
                "score": score
            })

        # Prepare the recommendation data
        recommendation_data = {
            "user": ObjectId(user_id),
            "recommendedItems": formatted_recommendations,
            "interactions": [interaction["_id"] for interaction in interactions],  # Store interactions as ObjectIds
            "algorithm": algorithm,
            "generatedAt": datetime.now(),
            "expiresAt": None,
            "stateRecommendation": "pending",
            "status": "active",
            "disabledAt": None,
            "modifiedOn": datetime.now(),
        }

        # Insert recommendation into MongoDB
        result = recommendation_collection.insert_one(recommendation_data)
        print(f"Saved recommendation with ID: {result.inserted_id}")
        return recommendation_data
    except Exception as e:
        print(f"Error saving recommendation: {e}")
        return None


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
    if similarity_matrix is None:
        print("Failed to compute similarity matrix.")
        return

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