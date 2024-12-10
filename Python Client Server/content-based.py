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

load_dotenv()
MONGODB_URI = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URI)
CORS(app)

df_merged = None  # Khởi tạo df_merged là None để tránh lỗi

# Kết nối với MongoDB và lấy dữ liệu
try:
    db = client.get_database()
    collection_variants = db['productvariants']
    collection_imagevariants = db['imagevariants']  # Kết nối với collection chứa ảnh
    data_variants = collection_variants.find()
    df_variants = pd.DataFrame(list(data_variants))

    # Lấy dữ liệu từ bảng product_v2
    collection_products = db['product_v2']
    data_products = collection_products.find()
    df_products = pd.DataFrame(list(data_products))

    # Kiểm tra xem 'slug' có tồn tại trong cả hai DataFrame không
    if 'slug' in df_variants.columns and 'slug' in df_products.columns:
        df_merged = pd.merge(df_variants, df_products[['slug', 'product_name']], on='slug', how='left')
        print(df_merged.head())
    else:
        raise ValueError("Cột 'slug' không tồn tại trong một trong hai DataFrame.")

except Exception as e:
    print(f"Error: {e}")

# Chỉ định tính năng sẽ dùng để tính độ tương đồng
if df_merged is not None:
    features = ['variant_name', 'variant_price']

    def combineFeatures(row):
        return str(row['variant_price']) + ' ' + str(row['variant_name'])

    df_merged['combinedFeatures'] = df_merged.apply(combineFeatures, axis=1)

    print(df_merged['combinedFeatures'].head())

    tf = TfidfVectorizer()
    tfMatrix = tf.fit_transform(df_merged['combinedFeatures'])

    similar = cosine_similarity(tfMatrix)

    number = 5

    @app.route('/recom/<slug>', methods=['GET'])
    def get_data(slug):
        result = []

        # Tìm kiếm product_v2 với slug đã cho
        matching_products = df_products[df_products['slug'].str.contains(slug, case=False)]
        if matching_products.empty:
            available_slugs = df_products['slug'].unique()
            return jsonify({'Lỗi': 'slug không hợp lệ', 'Có sẵn slug': available_slugs.tolist()})

        # Lấy _id của product từ product_v2
        product_id = matching_products.iloc[0]['_id']

        # Lọc productvariants theo product_id
        matching_variants = df_variants[df_variants['product'] == product_id]
        if matching_variants.empty:
            return jsonify({'Lỗi': 'Không tìm thấy biến thể nào cho sản phẩm này.'})

        # Lấy index đầu tiên của biến thể làm trọng tâm
        indexVariant = matching_variants.index[0]

        similarProduct = list(enumerate(similar[indexVariant]))
        sortedSimilarProduct = sorted(similarProduct, key=lambda x: x[1], reverse=True)

        def get_name(index):
            return df_merged.iloc[index]['variant_name']

        def get_price(index):
            return df_merged.iloc[index]['variant_price']

        def get_image(index):
            # Lấy thông tin hình ảnh từ collection imagevariants
            variant_id = df_merged.iloc[index]['_id']
            image_data = collection_imagevariants.find_one({"productVariant": variant_id})
            if image_data and 'image' in image_data:
                return image_data['image']
            return None

        def get_discount_percent(discount_id):
            # Lấy thông tin giảm giá từ collection discounts
            discount_data = db['discounts'].find_one({"_id": ObjectId(discount_id)})
            if discount_data and 'discountPercent' in discount_data:
                return discount_data['discountPercent']
            return None
        
        def get_product_slug(index):
            # Lấy _id của product từ df_merged
            product_id = df_merged.iloc[index]['product']  # Trường `product` tham chiếu tới _id của product_v2
            # Lấy slug của product_v2 từ df_products
            matching_product = df_products[df_products['_id'] == product_id]
            if not matching_product.empty:
                return matching_product.iloc[0]['slug']  # Trả về slug của product_v2
            return None  # Nếu không tìm thấy, trả về None

        for i in range(1, number + 1):
            index = sortedSimilarProduct[i][0]
            name = get_name(index)
            price = get_price(index)
            product_slug = get_product_slug(index)

            image_urls = get_image(index)
            variant_id = str(df_merged.iloc[index]['_id'])
            discount_id = df_merged.iloc[index]['product_discount']
            discount_percent = get_discount_percent(discount_id)

            result.append({
                'variant_name': name,
                'variant_price': int(price),
                'slug': product_slug,
                'images': image_urls,
                'variant_id': variant_id,
                'discount_percent': discount_percent
            })

        data = {'Sản phẩm gợi ý': result}
        return jsonify(data)

if __name__ == "__main__":
    app.run(port=1111)
