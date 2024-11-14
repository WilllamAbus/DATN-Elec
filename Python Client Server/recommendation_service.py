import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Get environment variables
MONGODB_URI = os.getenv('MONGODB_URI')

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client['BeReacts']  # Database
order_cart_collection = db["OrderCart"]  # Collection chứa OrderCart
order_detail_collection = db["OrderDetail"]  # Collection chứa OrderDetail
interaction_collection = db["interaction"]  # Collection chứa Interaction
recommendation_collection = db["recommendation"]
def get_product_variants(user_id):
    """
    Lấy danh sách `productVariant` từ các nguồn khác nhau như OrderCart, Interaction, hoặc productAuction.
    
    Parameters:
    user_id (str): ID của người dùng.
    
    Returns:
    list: Danh sách các `productVariant` liên quan đến người dùng từ các nguồn khác nhau.
    """
    # 1. Kiểm tra OrderCart và lấy productVariant từ đó
    order_cart = order_cart_collection.find_one({"user": ObjectId(user_id)})
    
    if order_cart:
        print("Lấy productVariant từ OrderCart...")
        order_detail_ids = order_cart.get("cartDetails", [])
        if order_detail_ids:
            order_details = order_detail_collection.find({"_id": {"$in": order_detail_ids}}, {"items.productVariant": 1})
            product_variants = []
            for detail in order_details:
                for item in detail.get("items", []):
                    product_variant = item.get("productVariant")
                    if product_variant:
                        product_variants.append(str(product_variant))  # Chuyển ID ObjectId sang chuỗi nếu cần
            return product_variants
    
    # 2. Nếu không có OrderCart, kiểm tra Interaction và lấy productVariant từ đó
    interactions = interaction_collection.find({"user": ObjectId(user_id)})
    product_variants_from_interactions = []
    for interaction in interactions:
        if "productVariant" in interaction:
            product_variants_from_interactions.append(str(interaction["productVariant"]))
        elif "productAuction" in interaction:  # Nếu không có productVariant, kiểm tra productAuction
            product_variants_from_interactions.append(str(interaction["productAuction"]))
    
    if product_variants_from_interactions:
        print("Lấy productVariant từ Interaction hoặc productAuction...")
        return product_variants_from_interactions

    print("Không tìm thấy productVariant từ OrderCart hay Interaction.")
    return []

def get_interactions(user_id):
    """
    Lấy tất cả các interaction của người dùng từ collection Interaction.

    Parameters:
    user_id (str): ID của người dùng.

    Returns:
    list: Một danh sách các document tương tác của người dùng.
    """
    return list(interaction_collection.find({"user": ObjectId(user_id)}))

def create_item_product_matrix():
    """
    Tạo ma trận tương tác người dùng - sản phẩm từ collection Interaction.

    Returns:
    DataFrame: Ma trận người dùng - sản phẩm với điểm số (score) tương ứng.
    """
    interactions = list(interaction_collection.find())
    if not interactions:
        print("Không có dữ liệu trong collection Interaction.")
        return None
    # Chuyển dữ liệu thành DataFrame
    df = pd.DataFrame(interactions)
    # Kiểm tra xem các cột 'user', 'productVariant', 'score' có tồn tại không
    required_columns = ['user', 'productVariant', 'score']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print(f"Thiếu các cột: {missing_columns}")
        return None
    
    # Chọn các cột cần thiết
    df = df[['user', 'productVariant', 'score']]
    df['user'] = df['user'].astype(str)
    # Tạo ma trận người dùng - sản phẩm, sử dụng productVariant làm cột và user làm chỉ mục
    user_product_matrix = df.pivot_table(index='user', columns='productVariant', values='score', fill_value=0)
    return user_product_matrix

def compute_item_similarity(user_product_matrix):
    """
    Tính toán sự tương đồng giữa các sản phẩm sử dụng phương pháp cosine similarity.

    Parameters:
    user_product_matrix (DataFrame): Ma trận người dùng - sản phẩm.

    Returns:
    DataFrame: Ma trận tương đồng giữa các sản phẩm.
    """
    # Sử dụng cosine similarity để tính toán độ tương đồng giữa các sản phẩm
    similarity_matrix = cosine_similarity(user_product_matrix.T)
    
    # Chuyển đổi thành DataFrame với các sản phẩm là chỉ mục và cột
    similarity_df = pd.DataFrame(similarity_matrix, index=user_product_matrix.columns, columns=user_product_matrix.columns)

    return similarity_df

def get_recommendations(user_product_matrix, similarity_matrix, user_id):
    if user_id not in user_product_matrix.index:
        print(f"User {user_id} không có trong ma trận người dùng - sản phẩm.")
        return []

    # Lấy sản phẩm người dùng đã tương tác
    user_interactions = user_product_matrix.loc[user_id]
    print(f"User interactions for {user_id}: {user_interactions}")  # In ra các tương tác của người dùng
    
    recommendations = {}
    for product in user_product_matrix.columns:
        if user_interactions[product] == 0:  # Chỉ gợi ý sản phẩm người dùng chưa tương tác
            similar_scores = similarity_matrix[product]
            weighted_score = sum(similar_scores * user_interactions) / sum(similar_scores)  # Tính điểm gợi ý
            recommendations[product] = weighted_score

    if not recommendations:
        print(f"Không có sản phẩm nào được gợi ý cho người dùng {user_id}.")
    # Sắp xếp gợi ý theo điểm gợi ý giảm dần
    recommended_products = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
    return [product for product, _ in recommended_products]

def save_recommendation(user_id, recommended_items, algorithm="collaborative_filtering"):
    """
    Save the generated recommendations to the 'recommendation' collection.
    
    Parameters:
    user_id (str): User ID who is receiving the recommendations.
    recommended_items (list): List of recommended items with their scores.
    algorithm (str): The algorithm used for recommendation (default is 'collaborative_filtering').
    
    Returns:
    dict: The created recommendation document.
    """
    recommendation_data = {
        "user": ObjectId(user_id),
        "recommendedItems": [{"item": ObjectId(item[0]), "score": item[1]} for item in recommended_items],
        "algorithm": algorithm,
        "generatedAt": datetime.now(),
        "expiresAt": None,  # You can set an expiration time if needed.
        "stateRecommendation": "pending",
        "status": "active"
    }

    # Insert the recommendation into the collection
    result = recommendation_collection.insert_one(recommendation_data)

    # Return the inserted recommendation document
    return recommendation_data


def main():
    # Ví dụ: Lấy gợi ý sản phẩm cho người dùng
    user_id = "66c894f1d65ff014f30b8788"  # Thay thế bằng ID của bạn

    # Lấy các `productVariant` từ các nguồn (OrderCart, Interaction, productAuction)
    product_variants = get_product_variants(user_id)
    print(f"Product variants for User {user_id}: {product_variants}")

    # Tạo ma trận người dùng - sản phẩm
    user_product_matrix = create_item_product_matrix()
    if user_product_matrix is None:
        print("Không thể tạo ma trận người dùng - sản phẩm.")
        return

    print("User-Product Matrix Index:", user_product_matrix.index)  # Thêm dòng này để kiểm tra index
    # Tính toán ma trận tương đồng sản phẩm
    similarity_matrix = compute_item_similarity(user_product_matrix)

    # Lấy gợi ý sản phẩm cho người dùng
    recommendations = get_recommendations(user_product_matrix, similarity_matrix, user_id)

    print(f"Recommended products for User {user_id}: {recommendations}")

    if recommendations:
    # Gợi ý có sẵn, lưu vào MongoDB với điểm thực tế
        saved_recommendation = save_recommendation(user_id, [(item, recommendations[item]) for item in recommendations])  
        print(f"Recommendation saved: {saved_recommendation}")
    else:
        print(f"No recommendations to save for user {user_id}.")

if __name__ == "__main__":
    main()
