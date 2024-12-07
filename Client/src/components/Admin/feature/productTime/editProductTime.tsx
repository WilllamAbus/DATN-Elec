import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../../ultils/breadcrumb/admin";
import { TimeTrackService } from "../../../../services/adminTimeTrack/adminTimeTrack";
import { Product } from "../../../../types/adminTimeTrack/addTimeTrack";
import { EditTimeTrackData } from "../../../../types/adminTimeTrack/editTimeTrack";

interface IFormInput {
  name: string;
  product_id: string;
  endTime: string;
  endTimeBid: string;
}

const EditTimeProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };

  const [isEndTimeSelected, setIsEndTimeSelected] = useState<boolean>(false);
  // const [selectedProduct, setSelectedProduct] = useState("");
  // const [selectedProductName, setSelectedProductName] = useState("");
  // const [, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [, setProducts] = useState<Product[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm<IFormInput>();
  const endTime = watch("endTime");
  const endTimeBid = watch("endTimeBid");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await TimeTrackService.getProductBy();
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
    const fetchTimeTrack = async () => {
      try {
        const response = await TimeTrackService.getTimeTrackWithProductDetails(
          id || ""
        );
        const { name, endTime, endTimeBid } = response.data;

        setValue("name", name);
        setValue("endTime", formatDateForInput(endTime));
        setValue("endTimeBid", formatDateForInput(endTimeBid));
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi lấy thời gian theo dõi");
      }
    };

    if (id) {
      fetchTimeTrack();
    }
  }, [id, setValue]);

  const formatDateForInput = (date: string): string => {
    const parts = date.split(/[/ :]/);
    return `${parts[2]}-${parts[1]}-${parts[0]}T${parts[3]}:${parts[4]}`;
  };

  const validateDates = () => {
    const currentDate = new Date();
    const endDate = new Date(endTime || "");

    // Validate if endTime and endTimeBid are the same
    if (endTime !== endTimeBid) {
      setError("endTimeBid", {
        type: "manual",
        message: "Thời gian kết thúc và thời gian kết thúc dự phòng phải giống nhau",
      });
      return false;
    }

    // Check if endTime is more than 30 days from today
    const timeDifference = (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
    if (timeDifference > 30) {
      setError("endTime", {
        type: "manual",
        message: "Thời gian kết thúc không được lớn hơn 30 ngày so với ngày hiện tại",
      });
      return false;
    }

    // Clear errors if validations pass
    clearErrors("endTime");
    clearErrors("endTimeBid");
    return true;
  };
  // const handleProductSelect = (productId: string) => {
  //   const selectedProduct = products.find((product) => product._id === productId);
  //   if (selectedProduct) {
  //     setSelectedProduct(productId);
  //     setSelectedProductName(selectedProduct.product_name);
  //     // So sánh với giá trị hiện tại
  //     const currentName = selectedProductName; // Giá trị tham chiếu từ input
  //     if (currentName && currentName !== selectedProduct.product_name) {
  //       setErrorMessage("Tên sản phẩm không khớp với sản phẩm đã chọn!");
  //     } else {
  //       setErrorMessage(""); // Xóa thông báo lỗi nếu khớp
  //     }
  //     setValue("name", selectedProduct.product_name); // Cập nhật giá trị trong form
  //   }
  // };
  const onSubmit = async (data: IFormInput) => {
 
      try {
      if (!validateDates()) {
        return;
      }
      const timeTrackData: EditTimeTrackData = {
        productName: data.name,
        productId: data.product_id,
        endTime: data.endTime,
        endTimeBid: data.endTimeBid,
      };
      await TimeTrackService.editTimeTrackAdminService(id || "", timeTrackData);
      toast.success("Cập nhật thành công")
      setTimeout(() => {
        navigate("/admin/listProdAuc");
    }, 2000);
   
  
   
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.editProducTime} />

      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Cập nhật thời gian đấu giá 
        </h1>
      </div>

      <div className="px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Tổng quan cập nhật
            </h3>
            <div className="grid grid-cols-6 gap-6">
            {/* <div className="col-span-4 sm:col-span-3">
                <label
                  htmlFor="product_variant"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tên sản phẩm
                </label>
                <Controller
                  control={control}
                  name="product_id"
                  render={({ field }) => (
                    <select
                      {...field}
                      value={selectedProduct}
                      onChange={(e) => {
                        handleProductSelect(e.target.value); // Update name when a product is selected
                        field.onChange(e); // Call onChange to update form state
                      }}
                      className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="">Chọn sản phẩm</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.product_name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.product_id && <p className="text-red-500 text-sm">Vui lòng chọn sản phẩm</p>}
              </div> */}
              <div className="col-span-4 sm:col-span-3">
                <label
                  htmlFor="product_variant"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ***
                </label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      disabled
                      className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  )}
                />
              </div>
             
              <div className="col-span-4 sm:col-span-3">
                <label
                  htmlFor="end_time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Giờ kết thúc
                </label>
                <Controller
                  control={control}
                  name="endTime"
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      {...field}
                      onChange={(e) => {
                        setIsEndTimeSelected(!!e.target.value);
                        field.onChange(e); // Call onChange to update form state
                      }}
                      className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  )}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
              {/* Conditionally render the end time bid field */}
              {isEndTimeSelected && (
                <div className="col-span-4 sm:col-span-3">
                  <label
                    htmlFor="endTimeBid"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Giờ kết thúc dự phòng
                  </label>
                  <Controller
                  control={control}
                  name="endTimeBid"
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      {...field}
                      className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  )}
                />
                {errors.endTimeBid && (
                  <p className="text-red-500 text-sm">
                    {errors.endTimeBid.message}
                  </p>
                )}
                </div>
              )}
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

export default EditTimeProduct;
