import React , { useEffect, useState} from 'react';
import { useParams } from "react-router-dom";

import '../../../../../assets/css/user.style.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import listTwo from "../../../../../assets/images/products/product15.png";
import Comment from '../../../../User/feature/details/comment/comment';
import { getOneProduct } from "../../../../../services/product/crudProduct.service";
import { getFileFirebase } from "../../../../../services/firebase/getFirebse.service";
import currencyFormatter from 'currency-formatter';
function formatCurrency(value:number) {
  return currencyFormatter.format(value, { code: 'VND', symbol: '' });
}
const ProductDetail:  React.FC = () => {
    const [quantity, setQuantity] = useState(1);
   
    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };
    const [product, setProduct] = useState<any | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();


    
    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                console.log("Không có ID sản phẩm nào được cung cấp");
                return;
            }
            try {
                const product = await getOneProduct(id);
                setProduct(product);
                if (product.image) {
                    const url = await getFileFirebase(product.image);
                    setImgPreview(url);
                }
            } catch (error) {
                console.log("Failed to fetch product data");
            }
        };

        fetchData();
    }, [id]);
    const calculatePrice = () => {
        if (!product) return 0;
        const basePrice = product.price * (1 - product.discount / 100);
        return basePrice * quantity;
    };
    return (
        <>
      
            {/* breadcrumb */}
            <div className="container py-4 flex items-center gap-3">
                <a href="/" className="text-primary text-base">
                    <i className="fa-solid fa-house"></i>
                </a>
                <span className="text-sm text-gray-400">
                    <i className="fa-solid fa-chevron-right"></i>
                </span>
                <p className="text-gray-600 font-medium">Product</p>
            </div>
            {/* ./breadcrumb */}

            {/* product-detail */}
          
  <div  className="container grid grid-cols-2 gap-6">
  <div >
      {imgPreview && (
                <div >
                  <img src={imgPreview} alt="Image Preview"     style={{ width: "450px", height: "450px" }}/>
                </div>
              )}
      {/* <div className="grid grid-cols-5 gap-4 mt-4">
          <img src="/images/products/product2.jpg" alt="product2" className="w-full cursor-pointer border border-primary" />
          <img src="/images/products/product3.jpg" alt="product2" className="w-full cursor-pointer border" />
          <img src="/images/products/product4.jpg" alt="product2" className="w-full cursor-pointer border" />
          <img src="/images/products/product5.jpg" alt="product2" className="w-full cursor-pointer border" />
          <img src="/images/products/product6.jpg" alt="product2" className="w-full cursor-pointer border" />
      </div> */}
  </div>

  <div>
     
       <h2 className="text-3xl font-medium uppercase mb-2">{product?.name}</h2>
      <div className="flex items-center mb-4">
          <div className="flex gap-1 text-sm text-yellow-400">
              <span><i className="fa-solid fa-star"></i></span>
              <span><i className="fa-solid fa-star"></i></span>
              <span><i className="fa-solid fa-star"></i></span>
              <span><i className="fa-solid fa-star"></i></span>
              <span><i className="fa-solid fa-star"></i></span>
          </div>


          
          <div className="text-xs text-gray-500 ml-3">(150 Reviews)</div>
      </div>
      <div className="space-y-2">
          <p className="text-gray-800 font-semibold space-x-2">
              <span>Trạng thái: </span>
              {product?.quantity > 0 ?<span className="text-green-600">Còn Hàng</span>:  <span className="text-red-600">Hết Hàng</span>}
          </p>
      </div>
      <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
          <p className="text-xl text-primary font-semibold">{formatCurrency(calculatePrice())} VNĐ</p>
          <p className="text-base text-gray-400 line-through">{formatCurrency(product?.price)}</p>
      </div>

      <p className="mt-4 text-gray-600"></p>

      <div className="pt-4">
          <h3 className="text-sm text-gray-800 uppercase mb-1">Kích thước</h3>
          <div className="flex items-center gap-2">
              <div className="size-selector">
                  <input type="radio" name="size" id="size-xs" className="hidden" />
                  <label htmlFor="size-xs" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">XS</label>
              </div>
              <div className="size-selector">
                  <input type="radio" name="size" id="size-sm" className="hidden" />
                  <label htmlFor="size-sm" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">S</label>
              </div>
              <div className="size-selector">
                  <input type="radio" name="size" id="size-m" className="hidden" />
                  <label htmlFor="size-m" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">M</label>
              </div>
              <div className="size-selector">
                  <input type="radio" name="size" id="size-l" className="hidden" />
                  <label htmlFor="size-l" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">L</label>
              </div>
              <div className="size-selector">
                  <input type="radio" name="size" id="size-xl" className="hidden" />
                  <label htmlFor="size-xl" className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">XL</label>
              </div>
          </div>
      </div>

      <div className="pt-4">
          <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Màu sắc</h3>
          <div className="flex items-center gap-2">
              <div className="color-selector">
                  <input type="radio" name="color" id="red" className="hidden" />
                  <label htmlFor="red" className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block" style={{ backgroundColor: '#fc3d57' }}></label>
              </div>
              <div className="color-selector">
                  <input type="radio" name="color" id="black" className="hidden" />
                  <label htmlFor="black" className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block" style={{ backgroundColor: '#000' }}></label>
              </div>
              <div className="color-selector">
                  <input type="radio" name="color" id="white" className="hidden" />
                  <label htmlFor="white" className="border border-gray-200 rounded-sm h-6 w-6 cursor-pointer shadow-sm block" style={{ backgroundColor: '#fff' }}></label>
              </div>
          </div>
      </div>

      <div className="mt-4">
      <h3 className="text-sm text-gray-800 uppercase mb-1">Số lượng</h3>
            <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                <div 
                    className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
                    onClick={decreaseQuantity}
                >
                    -
                </div>
                <div className="h-8 w-8 text-base flex items-center justify-center">{quantity}</div>
                <div 
                    className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
                    onClick={increaseQuantity}
                >
                    +
                </div>
            </div>
      </div>
        
      <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
          <a href="/checkout" className="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition">
              <i className="fa-solid fa-bag-shopping"></i> Mua ngay
          </a>
          <a href="/cart" className="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition">
              <i className="fa-solid fa-bag-shopping"></i> Thêm giỏ hàng
          </a>
          <a href="" className="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition">
              <i className="fa-solid fa-bag-shopping"></i> Add WatchList
          </a>
      </div>

  </div>
</div>
            

          
  
        
            
         
            {/* ./product-detail */}

            {/* description */}
            <div className="container pb-16">
                <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium">Chi tiết sản phẩm</h3>
                <div className="w-3/5 pt-6">
                    <div className="text-gray-600">
                        <table className="table-auto border-collapse w-full text-left text-gray-600 text-sm mt-6">
                            <tbody>
                                <tr>
                                    <td className="py-2">Brand</td>
                                    <td className="py-2">{product?.brand}</td>
                                </tr>
                                <tr>
                                    <td className="py-2">Description</td>
                                    <td className="py-2">{product?.description}</td>
                                </tr>
                            
                                <tr>
                                    <td className="py-2">Weight</td>
                                    <td className="py-2">{product?.weight}</td>
                                </tr>
                                <tr>
                                    <td className="py-2">Color</td>
                                    <td className="py-2">{product?.color}</td>
                                </tr>
                            
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* ./description */}

            {/* comments */}
            {/* <div className="container py-8">
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded" role="alert">
                        Comment submitted successfully!
                    </div>
                <div>
                <div className="flex items-start space-x-4 mb-4">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={Avatar} alt="avatar" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800"></p>
                                    <p className="text-gray-600">Sản Phẩm Tốt!!!</p>
                                </div>
                          <p className="text-yellow-400">    
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p> 
                           </p>
                            </div>
                 </div>
                 <div className="flex items-start space-x-4 mb-4">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={Avatar} alt="avatar" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800"></p>
                                    <p className="text-gray-600">Good!!!</p>
                                </div>
                          <p className="text-yellow-400">    
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p> 
                           </p>
                            </div>
                 </div>
                </div>
                <form  className="mt-6">
                    <div className="flex items-center space-x-3">
                        <input type="text" name="contents" placeholder="Enter your comment..." className="border border-gray-300 px-4 py-2 w-full focus:outline-none focus:border-primary rounded-md" />
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition focus:outline-none">Submit</button>
                    </div>
                    <div className="text-gray-400">    
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p> 
                    </div>
                </form>
            </div> */}
            <Comment/>
            {/* ./comments */}

            {/* related-products */}
            <div className="container pb-16">
                <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Related products</h2>
                <div className="grid grid-cols-4 gap-6">
                    {/* Related product cards */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <img src={listTwo} alt="related-product" className="w-full" />
                        <div className="p-4">
                            <h3 className="text-gray-800 font-medium">Related Product Name</h3>
                            <p className="text-gray-600">Related Product Price</p>
                            <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition focus:outline-none">View Details</button>
                        </div>
                    </div>
                    {/* Repeat for other related products */}
                </div>
            </div>
            {/* ./related-products */}
           
        </>
    );
};

export default ProductDetail;
