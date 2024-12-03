import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, jsonify, request

app = Flask(__name__)

load_dotenv()
MONGODB_URI = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URI)

df_merged = None  # Khởi tạo df_merged là None để tránh lỗi

try:
    db = client.get_database()
    collection_variants = db['productvariants']
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
        
        # Tìm slug có chứa chuỗi slug đã cho
        matching_slugs = df_merged[df_merged['slug'].str.contains(slug, case=False)]
        
        if matching_slugs.empty:
            # In ra các slug có trong df_merged để kiểm tra
            available_slugs = df_merged['slug'].unique()
            return jsonify({'Lỗi': 'slug không hợp lệ', 'Có sẵn slug': available_slugs.tolist()})
        
        indexProduct = matching_slugs.index[0]
        
        similarProduct = list(enumerate(similar[indexProduct]))

        print(similarProduct)

        sortedSimilarProduct = sorted(similarProduct, key=lambda x: x[1], reverse=True)

        def get_name(index):
            return df_merged[df_merged.index == index]['variant_name'].values[0]

        for i in range(1, number + 1):
            print(get_name(sortedSimilarProduct[i][0]))
            result.append(get_name(sortedSimilarProduct[i][0]))
        
        data = {'Sản phẩm gợi ý': result}
        return jsonify(data)
if __name__ == "__main__":
    app.run(port=1111)