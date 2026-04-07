import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchCategoriesThunk } from "../../../../redux/categories/categoriesThunk";
import {
  createVoucher,
  updateVoucher,
  fetchVoucherById,
} from "../../../../redux/discount/voucherThunk"; // Import your thunk
import { RootState, AppDispatch } from "../../../../redux/store";
import { Category } from "../../../../types/Categories.d";
import { Voucher } from "../../../../types/Voucher.d"; // Import your Discount type
import AlertCustomStyles from "../../../../ultils/alert.succes";
import { ToastContainer } from "react-toastify";

const EditDiscount: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>(); // Get ID from URL parameters
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Voucher>();
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null } | null>(
    null
  );
  const categories = useSelector((state: RootState) => state.categories.categories) as Category[];
  //   const discount = useSelector((state: RootState) => state.discount.discount);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text");
    if (!/^\d+$/.test(pastedData)) {
      e.preventDefault();
    }
  };
  useEffect(() => {
    if (id) {
      dispatch(fetchVoucherById(id))
        .unwrap()
        .then((voucher) => {
          // Populate form with discount data
          setValue("code", voucher.code);
          setValue("voucherNum", voucher.voucherNum);
          setValue("cateReady", voucher.cateReady);
          setValue("expiryDate", voucher.expiryDate);
          setValue("conditionActive", voucher.conditionActive);
        })
        .catch((error) => console.error("Error fetching discount:", error));
    }
    dispatch(fetchCategoriesThunk()); // Fetch categories for dropdown
  }, [id, dispatch, setValue]);

  const validateExpirationDate = (date: string) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const differenceInDays = (selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return differenceInDays >= 15 || "Hạn sử dụng 15 ngày.";
  };

  const onSubmit = async (data: Voucher) => {
    try {
      if (id) {
        // Ensure cateReady is an array
        if (typeof data.cateReady === "string") {
          data.cateReady = [data.cateReady];
        }
        await dispatch(updateVoucher({ id, updatedVoucher: data })).unwrap();
        setAlert({ message: "Cập nhật giảm giá thành công!", type: "success" });
      } else {
        await dispatch(createVoucher(data)).unwrap();
        setAlert({ message: "Cập nhật giảm giá không thành công!", type: "error" });
      }
      reset(); // Reset the form fields
      setTimeout(() => navigate("/admin/listVouchers"), 2000); // Navigate after 2 seconds
    } catch (error) {
      setAlert({ message: "Error saving discount!", type: "error" });
      console.error("Error saving discount:", error);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <ToastContainer />
      <div className="w-full px-4 py-6 lg:py-4 p-3 sm:p-5 antialiased">
        {alert && (
          <div className="mb-4">
            <AlertCustomStyles message={alert.message} type={alert.type} />
          </div>
        )}
        <form action="#">
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Mã giảm giá
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                defaultValue="VOUS2534"
                placeholder="Product brand"
                {...register("code", {
                  required: "Mã giảm giá không được để trống",
                  pattern: {
                    value: /^VOUS\d{4}$/,
                    message: "Mã giảm giá có dạng `VOUS1024`",
                  },
                })}
              />
              {errors.code && typeof errors.code.message === "string" && (
                <p className="text-red-500 text-xs">{errors.code.message}</p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Giá giảm
              </label>
              <input
                type="number"
                id="price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                defaultValue={2999}
                {...register("voucherNum", {
                  required: "Giá giảm không được để trống",

                  min: { value: 10.0, message: "Giá giảm phải lớn hơn 10.000" },
                  validate: (value) => !isNaN(value) || "Giá sản phẩm phải là số",
                })}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                onPaste={handlePaste}
              />
              {errors.voucherNum && typeof errors.voucherNum.message === "string" && (
                <p className="text-red-500 text-xs">{errors.voucherNum.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Danh mục sẵn sàng
              </label>
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                {...register("cateReady", { required: "Danh mục không được để trống" })}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.cateReady && typeof errors.cateReady.message === "string" && (
                <p className="text-red-500 text-xs">{errors.cateReady.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="item-weight"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Hạn sử dụng
              </label>
              <input
                type="date"
                id="item-weight"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                {...register("expiryDate", {
                  required: "Expiration date is required",
                  validate: validateExpirationDate,
                })}
              />
              {errors.expiryDate && typeof errors.expiryDate.message === "string" && (
                <p className="text-red-500 text-xs">{errors.expiryDate.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Mô tả
              </label>
              <textarea
                id="description"
                rows={8}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write a product description here..."
                defaultValue={
                  "Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US"
                }
                {...register("conditionActive", { required: "Mô tả không được để trống" })}
              />
              {errors.conditionActive && typeof errors.conditionActive.message === "string" && (
                <p className="text-red-500 text-xs">{errors.conditionActive.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              onClick={handleSubmit(onSubmit)}
            >
              {"Cập nhật"}
            </button>
            <Link
              to="/admin/listVouchers"
              className="text-white bg-emerald-700 hover:bg-lime-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Trở lại
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditDiscount;
