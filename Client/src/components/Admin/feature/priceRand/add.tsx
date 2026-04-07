import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import { PriceRandService } from "../../../../services/adminPriceRand/adminPriceRand";
import { Product , PriceRandData} from "../../../../types/adminPriceRand/addPriceRand";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const AddPriceRand: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Thêm state để lưu sản phẩm đã chọn
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const {
        handleSubmit,
    } = useForm<PriceRandData>();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await PriceRandService.getProductBy();
                if (response.status === 200) {
                    setProducts(response.data);
                } else {
                    toast.error("Lấy danh sách sản phẩm thất bại");
                }
            } catch (error) {
                toast.error("Đã có lỗi xảy ra khi lấy sản phẩm");
            }
        };

        fetchProducts();
    }, []);

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setSelectedProduct(selectedId);
        const product = products.find(p => p._id === selectedId);
        if (product) {
            setSelectedPrice(product.product_price_unit);
        } else {
            setSelectedPrice(null);
        }
    };

    const onSubmit = async () => {
        try {
            if (!selectedProduct) {
                toast.error("Vui lòng chọn sản phẩm");
                return;
            }
            const validPrice: PriceRandData = {
                bidInput: selectedPrice !== null ? selectedPrice.toString() : ""
            };
            await PriceRandService.createPriceRand(selectedProduct, validPrice);
            toast.success("Tạo khoảng định giá thành công!");
            setTimeout(() => {
                navigate("/admin/listPriceRand");
            }, 2000);
         
            // Thêm sản phẩm vào danh sách đã chọn sau khi tạo thành công
            setSelectedProducts([...selectedProducts, selectedProduct]);
        } catch (error: any) {
            if (error.message === "Sản phẩm này đã tồn tại.") {
                toast.error(error.message);
            } else {
                toast.error("Sản phẩm này đã tồn tại.");
            }
        }
    };

    // Lọc sản phẩm chưa được chọn
    const availableProducts = products.filter(product => !selectedProducts.includes(product._id.toString()));

    
    return (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <ToastContainer />
            <ReusableBreadcrumb items={breadcrumbItems.addPriceRand} />
            <div className="mb-4 ml-4 col-span-full xl:mb-2">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Thêm khoảng định giá
                </h1>
            </div>
            <div className="px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
                <div className="col-span-full xl:col-auto">
                    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                        <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan cập nhật</h3>

                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-4 sm:col-span-3">
                                <label
                                    htmlFor="product_variant"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Tên sản phẩm
                                </label>
                                <select
                                    id="product_variant"
                                    className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    value={selectedProduct}
                                    onChange={handleProductChange}
                                >
                                    <option value="">Chọn sản phẩm</option>
                                    {availableProducts.length > 0 ? (
                                        availableProducts.map((product) => (
                                            <option key={product._id} value={product._id}>
                                                {product.product_name} - Giá tiền: {product.product_price_unit.toLocaleString()} đ
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Không có sản phẩm nào</option>
                                    )}
                                </select>
                                <span className="text-red-500 text-xs italic"></span>
                            </div>
                            <div className="col-span-3 sm:col-span-6">
                                <label
                                    htmlFor="quantity"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Giá kích hoạt
                                </label>
                                <input
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    id="quantity"
                                    type="text"
                                    value={selectedPrice !== null ? selectedPrice.toLocaleString() : ''} 
                                />
                                <span className="text-red-500 text-xs italic"></span>
                            </div>
                        </div>

                        <br/>
                        <div className="col-span-6 sm:col-full">
                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Tạo ra khoảng định giá
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddPriceRand;
