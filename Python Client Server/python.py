import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
MONGODB_URI = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URI)

db = client.get_database()  # Access the database

# --- PART 1: RECOMMENDATION FOR PRODUCT VARIANTS ---

# Load data for product variants
try:
    collection_variants = db['productvariants']
    collection_imagevariants = db['imagevariants']
    data_variants = collection_variants.find()
    df_variants = pd.DataFrame(list(data_variants))

    collection_products = db['product_v2']
    data_products = collection_products.find()
    df_products = pd.DataFrame(list(data_products))

    if 'slug' in df_variants.columns and 'slug' in df_products.columns:
        df_merged = pd.merge(df_variants, df_products[['slug', 'product_name']], on='slug', how='left')
    else:
        raise ValueError("Cột 'slug' không tồn tại trong một trong hai DataFrame.")

except Exception as e:
    print(f"Error: {e}")
    df_merged = None

if df_merged is not None:
    def combine_features(row):
        return str(row['variant_price']) + ' ' + str(row['variant_name'])

    df_merged['combinedFeatures'] = df_merged.apply(combine_features, axis=1)

    tf = TfidfVectorizer()
    tfMatrix = tf.fit_transform(df_merged['combinedFeatures'])
    similar = cosine_similarity(tfMatrix)

    @app.route('/variant-recom/<slug>', methods=['GET'])
    def recommend_variants(slug):
        result = []

        matching_products = df_products[df_products['slug'].str.contains(slug, case=False)]
        if matching_products.empty:
            available_slugs = df_products['slug'].unique()
            return jsonify({'Lỗi': 'slug không hợp lệ', 'Có sẵn slug': available_slugs.tolist()})

        product_id = matching_products.iloc[0]['_id']
        matching_variants = df_variants[df_variants['product'] == product_id]
        if matching_variants.empty:
            return jsonify({'Lỗi': 'Không tìm thấy biến thể nào cho sản phẩm này.'})

        index_variant = matching_variants.index[0]
        similar_products = list(enumerate(similar[index_variant]))
        sorted_similar = sorted(similar_products, key=lambda x: x[1], reverse=True)

        def get_name(index):
            return df_merged.iloc[index]['variant_name']

        def get_price(index):
            return df_merged.iloc[index]['variant_price']

        def get_image(index):
            variant_id = df_merged.iloc[index]['_id']
            image_data = collection_imagevariants.find_one({"productVariant": variant_id})
            if image_data and 'image' in image_data:
                return image_data['image']
            return None

        def get_discount_percent(discount_id):
            discount_data = db['discounts'].find_one({"_id": ObjectId(discount_id)})
            if discount_data and 'discountPercent' in discount_data:
                return discount_data['discountPercent']
            return None

        def get_product_slug(index):
            product_id = df_merged.iloc[index]['product']
            matching_product = df_products[df_products['_id'] == product_id]
            if not matching_product.empty:
                return matching_product.iloc[0]['slug']
            return None

        for i in range(1, 6):
            index = sorted_similar[i][0]
            result.append({
                'variant_name': get_name(index),
                'variant_price': int(get_price(index)),
                'slug': get_product_slug(index),
                'images': get_image(index),
                'variant_id': str(df_merged.iloc[index]['_id']),
                'discount_percent': get_discount_percent(df_merged.iloc[index]['product_discount'])
            })

        return jsonify({'Sản phẩm gợi ý': result})

# --- PART 2: RECOMMENDATION FOR AUCTION PRODUCTS ---

try:
    # Tập hợp dữ liệu từ MongoDB
    product_auction_collection = db['productAuction']
    auction_pricing_collection = db['auctionPricingRange']

    product_data = product_auction_collection.find()
    auction_pricing_data = auction_pricing_collection.find({"status": "active"})

    # Chuyển dữ liệu thành DataFrame
    df_products_auction = pd.DataFrame(list(product_data))
    df_auction_pricing = pd.DataFrame(list(auction_pricing_data))

    # Kiểm tra nếu dữ liệu không rỗng
    if not df_products_auction.empty and not df_auction_pricing.empty:
        # Chuyển `_id` và `product_randBib` sang dạng chuỗi để dễ nối
        df_products_auction['_id'] = df_products_auction['_id'].astype(str)
        df_auction_pricing['product_randBib'] = df_auction_pricing['product_randBib'].astype(str)

        # Lọc các sản phẩm chỉ liên quan đến các bản ghi trong auctionPricingRange (trạng thái "active")
        df_products_auction = pd.merge(
            df_products_auction,
            df_auction_pricing[['product_randBib', 'status']],
            left_on='_id',
            right_on='product_randBib',
            how='inner'
        )

        # Hàm tạo chuỗi đặc điểm kết hợp (combined features)
        def combine_features_auction(row):
            product_name = row['product_name'] if pd.notnull(row['product_name']) else ''
            product_type = row.get('product_type', '') if pd.notnull(row.get('product_type', '')) else ''
            product_brand = row.get('product_brand', '') if pd.notnull(row.get('product_brand', '')) else ''
            return f"{product_name} {product_type} {product_brand}".strip()

        df_products_auction['combinedFeatures'] = df_products_auction.apply(combine_features_auction, axis=1)

        # Xử lý giá trị NaN nếu có
        df_products_auction['combinedFeatures'] = df_products_auction['combinedFeatures'].fillna('default')

        # Tạo ma trận TF-IDF
        tfidf = TfidfVectorizer(stop_words=None)
        tfidf_matrix = tfidf.fit_transform(df_products_auction['combinedFeatures'])
        similarity_matrix = cosine_similarity(tfidf_matrix)

        @app.route('/auction-recom/<slug>', methods=['GET'])
        def recommend_auctions(slug):
            """
            API để gợi ý sản phẩm dựa trên slug.
            """
            print(f"Received slug: {slug}")
            print("Current slugs:", df_products_auction['slug'].tolist())

            # Kiểm tra nếu slug không tồn tại
            if slug not in df_products_auction['slug'].values:
                available_slugs = df_products_auction['slug'].dropna().tolist()[:5]
                return jsonify({
                    'error': 'Invalid slug',
                    'requested_slug': slug,
                    'available_slugs': available_slugs
                }), 400

            # Tiếp tục xử lý nếu slug hợp lệ
            product_index = df_products_auction[df_products_auction['slug'] == slug].index[0]
            similarity_scores = list(enumerate(similarity_matrix[product_index]))
            sorted_products = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

            # Tạo danh sách gợi ý sản phẩm
            recommendations = []
            for i in range(1, min(6, len(sorted_products))):
                recommended_index = sorted_products[i][0]
                # Kiểm tra nếu cột 'status' có tồn tại trong DataFrame
                product_id = df_products_auction.iloc[recommended_index]['product_brand']  # Lấy _id của thương hiệu
                brand_name = None

                # Kiểm tra và lấy tên thương hiệu từ collection 'Brand'
                brand_data = db['brands'].find_one({'_id': ObjectId(product_id)})
                if brand_data:
                    brand_name = brand_data.get('name', 'Unknown Brand')
                    
                supplier_name = 'Unknown Supplier'  # Giá trị mặc định
                supplier_id = df_products_auction.iloc[recommended_index]['product_supplier']  # Lấy _id nhà cung cấp
                supplier_data = db['suppliers'].find_one({'_id': ObjectId(supplier_id)})
                if supplier_data:
                    supplier_name = supplier_data.get('name', 'Unknown Supplier')
                df_products_auction.rename(columns={'status_y': 'status'}, inplace=True)

                # Kiểm tra cột 'status' đã được đổi tên chưa
                if 'status' not in df_products_auction.columns:
                    print("Cột 'status' không tồn tại trong DataFrame.")
                else:
                    recommendations.append({
                        'product_name': df_products_auction.iloc[recommended_index]['product_name'],
                        'slug': df_products_auction.iloc[recommended_index]['slug'],
                        'image': df_products_auction.iloc[recommended_index].get('image', ''),
                        'status': df_products_auction.iloc[recommended_index]['status'],
                        'brand_name': brand_name,
                        'supplier_name': supplier_name
                    })

            # Trả về kết quả
            if not recommendations:
                return jsonify({'error': 'No similar products found'}), 404

            return jsonify({'Sản phẩm gợi ý': recommendations})

    else:
        print("No data found in either productAuction or auctionPricingRange.")


except Exception as e:
    print(f"Error: {e}")

if __name__ == "__main__":
    app.run(port=1111)

