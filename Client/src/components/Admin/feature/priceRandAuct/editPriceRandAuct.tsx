import React, { useEffect, useState } from "react";
import { useForm,  } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../../ultils/breadcrumb/admin";
import { PriceRandService, getProductInbound }
 from "../../../../services/adminPriceRand/adminPriceRandAuct";
import { Product } from "../../../../types/adminTimeTrack/addTimeTrack";
import { EditPriceRandAuctData } from "../../../../types/adminPriceRandAuct/editPriceRandAuct";
import currencyFormatter from "currency-formatter";
import FormInput from "./formInput";

interface IFormInput {
    maxPrice?:string, 
    startTime?: string, 
    endTime?: string,
   priceStep?: string , 
   product_randBib?: string,
   startingPrice?: string
   productName?: string; // Add this field for product name
   inboundPrice?: string;
}
function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
const EditPriceRandProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   const [isEndTimeSelected, setIsEndTimeSelected] = useState<boolean>(false);
//   const [selectedProducts, ] = useState<string[]>([]); // Thêm state để lưu sản phẩm đã chọn
    const [selectedProduct, ] = useState<string>("");
  // const [selectedProductName, setSelectedProductName] = useState("");
  // const [, setErrorMessage] = useState("");
  const navigate = useNavigate();
    const [, setProducts] = useState<Product[]>([]);
  const [, setInboundPrice] = useState<number | null>(null);
  const [fetchedStartingPrice, setFetchedStartingPrice] = useState<number | null>(null);
  const [fetchedInboundPrice, setFetchedInboundPrice] = useState<number | null>(null);
  const [fetchedPriceStep, setFetchedPriceStep] = useState<number | null>(null);
  const [fetchedMaxPrice, setFetchedMaxPrice] = useState<number | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm<IFormInput>();
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
  useEffect(() => {
    const fetchPriceRandAuct = async () => {
      try {
        const response = await PriceRandService.getPriceRandById(
          id || ""
        );
        const {
        
     
            startingPrice,
            maxPrice,
            priceStep,
            product_randBib
          } = response.data.auctionPricerand;
  
          
          const inboundPrice = response.data.inboundPrice;
          const starTimeTracker = response.data.auctTionStartTime
          const enDTimePriceTracker = response.data.auctionEndTime
          // Gán các giá trị vào form
          setValue("product_randBib", product_randBib?._id); 
          setValue("productName", product_randBib?.product_name); // Gán tên sản phẩm
          setValue("startTime", starTimeTracker); // Gán thời gian bắt đầu
          setValue("endTime", enDTimePriceTracker);
          setFetchedInboundPrice(inboundPrice) // Gán thời gian kết thúc
          setValue("inboundPrice", formatCurrency(inboundPrice));
          setFetchedStartingPrice(startingPrice);  // Gán giá inboundPrice
          setValue("startingPrice", startingPrice); // Gán
          setFetchedMaxPrice(maxPrice)
          setValue("maxPrice", maxPrice); // Gán giá tối đa
          setFetchedPriceStep(priceStep)
          setValue("priceStep", priceStep); // Gán bước giá 
      
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi lấy thời gian theo dõi");
      }
    };

    if (id) {
        fetchPriceRandAuct();
    }
  }, [id, setValue]);

//   const formatDateForInput = (date: string): string => {
//     const parts = date.split(/[/ :]/);
//     return `${parts[2]}-${parts[1]}-${parts[0]}T${parts[3]}:${parts[4]}`;
//   };
//   const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedProduct(selectedId);

//   // Find the selected product and set its name to the form value
//   const product = products.find(p => p._id === selectedId);
//   if (product) {
//     setValue("product_randBib", product.product_name); // Set the product name
//   }


//   };
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

  const onSubmit = async (data: IFormInput) => {
 
      try {
        const pricrRandAuctData: EditPriceRandAuctData = {
            maxPrice: data.maxPrice, 
            startTime: data.startTime,  
            endTime: data.endTime,
           priceStep: data.priceStep , 
           startingPrice: data.startingPrice,
           product_randBib: data.product_randBib
          };
          const converNumber = (Number(data.startingPrice))
          const inBoundPrice = (Number(fetchedInboundPrice))
              const converNumberMax = (Number(data.maxPrice))
      if (!validateDates()) {
        return;
      }
   
  
        // Check if endTime is provided
        if (inBoundPrice !== null && data.startingPrice !== undefined && converNumber < inBoundPrice) {
          toast.error(
            `Giá khởi điểm (${formatCurrency(converNumber)}) phải lớn hơn giá ban đầu (${formatCurrency(inBoundPrice)})`
          );
          return;
        }
      
        if ( converNumberMax < converNumber) {
          toast.error(
            `Giá tối đa (${formatCurrency(converNumberMax)}) phải lớn hơn giá khởi điểm (${formatCurrency(converNumber)})`
          );
          return;
        }
      await PriceRandService.editPriceRandAuctAdminService(id || "", pricrRandAuctData);
      toast.success("Cập nhật thành công")
      setTimeout(() => {
        navigate("/admin/triggerAuct");
    }, 2000);
   
  
   
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };
//   const availableProducts = products.filter(
//     (product) => !selectedProducts.includes(product._id.toString())
//   );
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
            Cập nhật phiên đấu giá
          </h3>

          <div className="grid grid-cols-6 gap-6">
          <div className="col-span-2 sm:col-span-2">
          <input
   id="product_randBib"
   type="hidden"
  
   {...register("product_randBib")}
    className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg 
    focus:ring-primary-500 focus:border-primary-500 block 
    w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
    dark:placeholder-gray-400 dark:text-white 
    dark:focus:ring-primary-500 dark:focus:border-primary-500"
  />
  <label
    htmlFor="product_randBib"
    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  >
    Tên sản phẩm
  </label>
  <input
   id="productName"
   type="text"
   readOnly
   {...register("productName")}
    className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg 
    focus:ring-primary-500 focus:border-primary-500 block 
    w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
    dark:placeholder-gray-400 dark:text-white 
    dark:focus:ring-primary-500 dark:focus:border-primary-500"
  />
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
    
        readOnly
        {...register("inboundPrice")}
        className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg 
          focus:ring-primary-500 focus:border-primary-500 block 
          w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 
          dark:placeholder-gray-400 dark:text-white 
          dark:focus:ring-primary-500 dark:focus:border-primary-500"
      />
    </div>
</div>

            <div className="col-span-2 sm:col-span-2">
            <FormInput
                id="startTime"
                label="Thời gian bắt đầu"
                type="datetime-local"
                control={control}
                register={register}
                defaultValue={startTime ? startTime : ""}
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
              
                register={register}
                defaultValue={endTime ? endTime : ""}
                control={control}
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
                defaultValue={fetchedStartingPrice ? formatCurrency(fetchedStartingPrice) : ""}
             //   error={errors.startingPrice}
                control={control}
            
                // error={errors.startingPrice}
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
                defaultValue={fetchedMaxPrice ? formatCurrency(fetchedMaxPrice) : ""}
                control={control}
                // error={errors.maxPrice}
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
                defaultValue={fetchedPriceStep ? formatCurrency(fetchedPriceStep) : ""}
                // error={errors.maxPrice}
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
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
  );
};

export default EditPriceRandProduct;
