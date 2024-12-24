import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../../ultils/breadcrumb/admin";
import { PriceRandService, getProductInbound }
 from "../../../../services/adminPriceRand/adminPriceRandAuct";
import {
  Product,
  PriceRandData,
} from "../../../../types/adminPriceRandAuct/addPriceRandAuct";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import FormInput from "../productV2/Form/forminput";
import currencyFormatter from "currency-formatter";
// import FormSelect from "./formSelect";
function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
const AddPriceRand: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Thêm state để lưu sản phẩm đã chọn
  const [selectedProduct, setSelectedProduct] = useState<string>("");
//   const [selectedPrice, ] = useState<number | null>(null);
const [inboundPrice, setInboundPrice] = useState<number | null>(null);
  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    formState: { errors },
    setError, // We need this to set custom errors
    clearErrors,
  } = useForm<PriceRandData>();
  const navigate = useNavigate();
  const startTime = watch("startTime");

  const endTime = watch("endTime");
  const handleMaxPrice = (maxPrice: string) => {
    setValue("maxPrice", maxPrice);
  };
  const handleStartingPrice = (startingPrice: string) => {
    setValue("startingPrice", startingPrice);
  };
  const handlePriceStep = (priceStep: string) => {
    setValue("priceStep", priceStep);
  };
  const location = useLocation();



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

  useEffect(() => {
    const fetchInboundPrice = async () => {
      if (!selectedProduct) return;

      
      try {
        const response = await getProductInbound(selectedProduct);
     
        
        if (response?.success === true) {
            const price = response.data.inbound_price
        
            
          setInboundPrice(price); // Giả định API trả về giá trị này
        } else {
          toast.error("Không thể lấy giá sản phẩm");
          setInboundPrice(null);
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi lấy giá sản phẩm");
        setInboundPrice(null);
      }
    };

    fetchInboundPrice();
  }, [selectedProduct]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedProduct(selectedId);


  };
  const validateDates = () => {
    const currentDate = new Date();
    const endDate = new Date(endTime || "");
    // const backupEndDate = new Date(endTimeBid || "");

    if (!startTime || !endTime || new Date(startTime) >= new Date(endTime)) {
      setError("endTime", {
        type: "manual",
        message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
      });
      return false;
    }

    // Check if endTime is more than 30 days from today
    const timeDifference =
      (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
    if (timeDifference > 30) {
      setError("endTime", {
        type: "manual",
        message:
          "Thời gian kết thúc không được lớn hơn 30 ngày so với ngày hiện tại",
      });
      return false;
    }

    clearErrors("endTime");
    clearErrors("startTime");
    return true;
  };
  useEffect(() => {
    if (location.state?.selectedProducts) {
      setSelectedProducts(location.state.selectedProducts);
    }
  }, [location.state]);
  useEffect(() => {
    // Lấy danh sách sản phẩm đã chọn từ localStorage khi component được mount
    const storedSelectedProducts = localStorage.getItem("selectedProducts");
    if (storedSelectedProducts) {
      setSelectedProducts(JSON.parse(storedSelectedProducts));
    }
  }, []);
  const onSubmit = async (data: PriceRandData) => {
    try {
      if (!validateDates()) {
        return;
      }
      if (!selectedProduct) {
        toast.error("Vui lòng chọn sản phẩm");
        return;
      }
      const converNumber = (Number(data.startingPrice))

      const converNumberMax = (Number(data.maxPrice))
  // Check if endTime is provided
  if (inboundPrice !== null && data.startingPrice !== undefined && converNumber < inboundPrice) {
    toast.error(
      `Giá khởi điểm (${formatCurrency(converNumber)}) phải lớn hơn giá ban đầu (${formatCurrency(inboundPrice)})`
    );
    return;
  }

  if ( converNumberMax < converNumber) {
    toast.error(
      `Giá tối đa (${formatCurrency(converNumberMax)}) phải lớn hơn giá khởi điểm (${formatCurrency(converNumber)})`
    );
    return;
  }
      await PriceRandService.createPriceRand(selectedProduct, data);
      toast.success("Tạo khoảng định giá thành công!");
 

      // Thêm sản phẩm vào danh sách đã chọn sau khi tạo thành công
      const updatedSelectedProducts = [...selectedProducts, selectedProduct];

      setSelectedProducts(updatedSelectedProducts);

      // Lưu vào localStorage
      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(updatedSelectedProducts)
      );
  
      // Cập nhật danh sách sản phẩm khả dụng
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== selectedProduct)
      );
  
      setSelectedProduct("");
      setInboundPrice(null);
         setTimeout(() => {
        navigate("/admin/triggerAuct");
      }, 2000);
    } catch (error: any) {
      if (error.message === "Sản phẩm này đã tồn tại.") {
        toast.error(error.message);
      } else {
        toast.error("Sản phẩm này đã tồn tại.");
      }
    }
  };

  // Lọc sản phẩm chưa được chọn
  const availableProducts = products.filter(
    (product) => !selectedProducts.includes(product._id.toString())
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addPriceRand} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white"></h1>
      </div>
      <div className="px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              {" "}
              Mở phiên đấu giá
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-2 sm:col-span-2">
              {/* <FormSelect
        label="Sản phẩm"
        id="product_variant"
        options={availableProducts.map((product) => ({
          _id: product._id,
          name: product.product_name,
        }))}
        register={register} // Bạn có thể gán register theo nhu cầu
        errorMessage=""
        validation={{ required: "Vui lòng chọn sản phẩm" }}
        className="mb-4"
      /> */}
                <label
                  htmlFor="product_variant"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tên sản phẩm
                </label>
                <select
                  id="product_randBid"
                  className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                  focus:ring-primary-500 focus:border-primary-500 block 
                  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                  dark:placeholder-gray-400 dark:text-white 
                  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                
                  value={selectedProduct}
                  onChange={handleProductChange}
               
                >
                  <option value="">Chọn sản phẩm</option>
                  {availableProducts.length > 0 ? (
                    availableProducts.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.product_name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không có sản phẩm nào</option>
                  )}
                </select>
                <span className="text-red-500 text-xs italic"></span>
                {selectedProduct && inboundPrice !== null ? (
    <div className="mt-4">
      <label
        htmlFor="inbound_price"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Giá ban đầu (đ)
      </label>
      <input
        type="text"
        id="inbound_price"
        value={formatCurrency(inboundPrice) }
        readOnly
        className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg 
          focus:ring-primary-500 focus:border-primary-500 block 
          w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 
          dark:placeholder-gray-400 dark:text-white 
          dark:focus:ring-primary-500 dark:focus:border-primary-500"
      />
    </div>
  ) : selectedProduct ? (
    <div className="mt-4 text-gray-500">Đang tải giá nhập...</div>
  ) : null}
              </div>
              <div className="col-span-2 sm:col-span-2">
              <FormInput
                  id="startTime"
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                  control={control}
                  register={register}
                  error={errors.startTime}
                  validation={{
                    required: "Vui lòng nhập thời gian bắt đầu",
                  }}
                />
             

                <span className="text-red-500 text-xs italic"></span>
              </div>
              <div className="col-span-2 sm:col-span-2">
              <FormInput
                  id="endTime"
                  label="Thời gian kết thúc"
                  type="datetime-local"
                  control={control}
                  register={register}
                  error={errors.endTime}
                  validation={{
                    required: "Vui lòng nhập thời gian kết thúc",
                  }}
                />
             

                <span className="text-red-500 text-xs italic"></span>
              </div>
            </div>
            <br />
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-2 sm:col-span-2">
              <FormInput
                  id="startingPrice"
                  label="Giá khởi điểm"
                  format
                  suffix=" đ"
                  register={register}
                  control={control}
                  error={errors.startingPrice}
                  validation={{
                    required: "Vui lòng nhập giá khởi điểm",
                    min: {
                      value: 1000,
                      message: "Giá khởi điểm không thể thấp hơn 1000",
                    },
                    max: {
                      value: 2000000000,
                      message: "Giá khởi điểm không thể vượt quá 2000000000",
                    },
                    validate: {
                        divisibleByTwo: (value: any) => {
                          // Ensure the value is a number
                          const numberValue = parseInt(value, 10);
                      
                          // Extract the thousands digit by dividing by 1000, then using Math.floor, and checking divisibility by 2
                          const thousandsDigit = Math.floor((numberValue / 1000) % 10);
                      
                          return (
                            thousandsDigit % 2 === 0 || "Giá tối đa phải có số ở hàng nghìn chia hết cho 2"
                          );
                        },
                        endsWithThreeZeros: (value: any) => {
                            // Ensure the value is a number
                            const numberValue = parseInt(value, 10);
                        
                            // Check if the last three digits are zeros
                            return (
                              numberValue % 1000 === 0 ||
                              "Giá khởi điểm phải có số ở hàng trăm, hàng chục và hàng đơn vị là 0"
                            );
                          },
                      },
                    valueAsNumber: true,
                  }}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    handleStartingPrice(floatValue?.toString() ?? "0");
                  }}
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
              <FormInput
                  id="maxPrice"
                  label="Giá tối đa"
                  format
                  suffix=" đ"
                  register={register}
                  control={control}
                  error={errors.maxPrice}
                  validation={{
                    required: "Vui lòng nhập giá tối đa",
                    min: {
                      value: 1000,
                      message: "Giá tối đa không thể thấp hơn 1000",
                    },
                    max: {
                      value: 2000000000,
                      message: "Giá tối đa không thể vượt quá 2000000000",
                    },
                    validate: {
                        divisibleByTwo: (value: any) => {
                          // Ensure the value is a number
                          const numberValue = parseInt(value, 10);
                      
                          // Extract the thousands digit by dividing by 1000, then using Math.floor, and checking divisibility by 2
                          const thousandsDigit = Math.floor((numberValue / 1000) % 10);
                      
                          return (
                            thousandsDigit % 2 === 0 || "Giá tối đa phải có số ở hàng nghìn chia hết cho 2"
                          );
                        },
                        endsWithThreeZeros: (value: any) => {
                            // Ensure the value is a number
                            const numberValue = parseInt(value, 10);
                        
                            // Check if the last three digits are zeros
                            return (
                              numberValue % 1000 === 0 ||
                              "Giá tối đa phải có số ở hàng trăm, hàng chục và hàng đơn vị là 0"
                            );
                          },
                      },
                    valueAsNumber: true,
                  }}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    handleMaxPrice(floatValue?.toString() ?? "0");
                  }}
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
              <FormInput
                  id="priceStep"
                  label="Bước giá"
                  format
                  suffix=" đ"
                  register={register}
                  control={control}
                  error={errors.maxPrice}
                  validation={{
                    required: "Vui lòng nhập bước giá",
                    min: {
                      value: 1000,
                      message: "bước giá  không thể thấp hơn 1000",
                    },
                    max: {
                      value: 2000000000,
                      message: "Bước giá không thể vượt quá 2000000000",
                    },
                    validate: {
                        divisibleByTwo: (value: any) => {
                          // Ensure the value is a number
                          const numberValue = parseInt(value, 10);
                      
                          // Extract the thousands digit by dividing by 1000, then using Math.floor, and checking divisibility by 2
                          const thousandsDigit = Math.floor((numberValue / 1000) % 10);
                      
                          return (
                            thousandsDigit % 2 === 0 || "Giá tối đa phải có số ở hàng nghìn chia hết cho 2"
                          );
                        },
                        endsWithThreeZeros: (value: any) => {
                            // Ensure the value is a number
                            const numberValue = parseInt(value, 10);
                        
                            // Check if the last three digits are zeros
                            return (
                              numberValue % 1000 === 0 ||
                              "Bước giá phải có số ở hàng trăm, hàng chục và hàng đơn vị là 0"
                            );
                          },
                      },
                    valueAsNumber: true,
                  }}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    handlePriceStep(floatValue?.toString() ?? "0");
                  }}
                />
              </div>
            </div>
            <br />
            <div className="col-span-6 sm:col-full">
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Tạo ra phiên đấu giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddPriceRand;
