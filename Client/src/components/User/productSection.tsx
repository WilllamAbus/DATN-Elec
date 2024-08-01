import React, { useEffect, useState } from "react";
import { listProduct } from "../../services/product/crudProduct.service";
import currencyFormatter from 'currency-formatter';
import { Link } from "react-router-dom";
function formatCurrency(value:number) {
  return currencyFormatter.format(value, { code: 'VND', symbol: '' });
}


const ProductSection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await listProduct();
        setProducts(productList);
      } catch (error) {
       console.log(`lỗi: `,error);
      }
    };

    fetchProducts();
  }, []);
  
    return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        Đề xuất cho bạn
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow rounded overflow-hidden group"
          >
            <div className="relative">
              <Link to={`/detailProd/${product._id}`}>
                <img
                  src={product.image}
                  alt={`product ${index + 1}`}
                  className="w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition"></div>
              </Link>
            </div>
            <div className="pt-4 pb-3 px-4">
              <a href="/detailProd">
                <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                  {product.name}
                </h4>
              </a>
              <div className="flex items-baseline mb-1 space-x-2">
                <p className="text-xl text-primary font-semibold">
                {formatCurrency(product.price * ( 1 - product.discount / 100))}VNĐ
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex gap-1 text-sm text-yellow-400">
                  {[...Array(product.rating)].map((_, i) => (
                    <span key={i}>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 items-center m-3">
                ({product?.view} Lượt xem)
                </div>
              </div>
            </div>
            <a
              href=""
              className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition"
            >
              Thêm giỏ hàng
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
