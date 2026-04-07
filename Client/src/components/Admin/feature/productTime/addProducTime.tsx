import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  breadcrumbItems,
  ReusableBreadcrumb,
} from "../../../../ultils/breadcrumb/admin";
import { TimeTrackService } from "../../../../services/adminTimeTrack/adminTimeTrack";
import {
  Product,
  TimeTrackData,
} from "../../../../types/adminTimeTrack/addTimeTrack";
import { useNavigate } from "react-router-dom";
const AddTimeProduct: React.FC = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setError, // We need this to set custom errors
    clearErrors,
  } = useForm<TimeTrackData>();
  const [products, setProducts] = useState<Product[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const navigate = useNavigate();
  // Watch both endTime and endTimeBid fields to conditionally display backup field
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

  const validateDates = () => {
    const currentDate = new Date();
    const endDate = new Date(endTime || "");
    // const backupEndDate = new Date(endTimeBid || "");

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

    clearErrors("endTime");
    clearErrors("endTimeBid");
    return true;
  };

  const onSubmit = async (data: TimeTrackData) => {
    if (!validateDates()) {
      return;
    }

    if (!selectedProduct) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

   await TimeTrackService.createTimeTrack(selectedProduct, data);
   toast.success("Thời gian cho sản phẩm đã được tạo thành công")
   setTimeout(() => {
    navigate("/admin/listProdAuc");
}, 2000);
  
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addProducTime} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm thời gian đấu giá sản phẩm
        </h1>
      </div>
      <div className="px-4 pt-4 xl:grid-cols-[1fr_2fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Tổng quan thêm mới
            </h3>

            <div className="grid grid-cols-6 gap-6">
              {/* Select Product */}
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
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.product_name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không có sản phẩm nào</option>
                  )}
                </select>
                {!selectedProduct && (
                  <span className="text-red-500 text-xs italic">
                    Vui lòng chọn sản phẩm
                  </span>
                )}
              </div>

              {/* End Time */}
              <div className="col-span-3 sm:col-span-6">
                <label
                  htmlFor="endTime"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Thời gian kết thúc
                </label>
                <Controller
                  name="endTime"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập thời gian kết thúc" }}
                  render={({ field }) => (
                    <input
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      id="endTime"
                    type="datetime-local"
                      {...field}
                    />
                  )}
                />
                {errors.endTime && (
                  <span className="text-red-500 text-xs italic">
                    {errors.endTime.message}
                  </span>
                )}
              </div>

              {/* End Time Bid (Backup) */}
              <div
                className={`col-span-6 sm:col-span-6 ${!endTime ? "hidden" : ""}`}
              >
                <label
                  htmlFor="endTimeBid"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Thời gian kết thúc dự phòng
                </label>
                <Controller
                  name="endTimeBid"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập thời gian dự phòng" }}
                  render={({ field }) => (
                    <input
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      id="endTimeBid"
                    type="datetime-local"
                      {...field}
                      disabled={!endTime}
                    />
                  )}
                />
                {errors.endTimeBid && (
                  <span className="text-red-500 text-xs italic">
                    {errors.endTimeBid.message}
                  </span>
                )}
              </div>
            </div>

            <br />

            {/* Submit Button */}
            <div className="col-span-6 sm:col-full">
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Tạo ra sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTimeProduct;
