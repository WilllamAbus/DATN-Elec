import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'; 
import { fetchCategoriesThunk } from "../../../../redux/categories/categoriesThunk";
import { createVoucher, updateVoucher, fetchVoucherById } from '../../../../redux/discount/voucherThunk'; // Import your thunk
import { RootState, AppDispatch } from '../../../../redux/store';
import { Category } from "../../../../types/Categories.d";
import { Voucher } from "../../../../types/Voucher.d"; // Import your Discount type
import AlertCustomStyles from '../../../../ultils/alert.succes';

const EditDiscount: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate(); 
  const { id } = useParams<{ id?: string }>(); // Get ID from URL parameters
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Voucher>();
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null } | null>(null);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  ) as Category[];
//   const discount = useSelector((state: RootState) => state.discount.discount);

  useEffect(() => {
    if (id) {
      dispatch(fetchVoucherById(id))
        .unwrap()
        .then(voucher => {
          // Populate form with discount data
          setValue('code', voucher.code);
          setValue('voucherNum', voucher. voucherNum);
          setValue('cateReady', voucher.cateReady);
          setValue('expiryDate', voucher.expiryDate);
          setValue('conditionActive', voucher.conditionActive);
        })
        .catch(error => console.error('Error fetching discount:', error));
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
        if (typeof data.cateReady === 'string') {
          data.cateReady = [data.cateReady];
        }
        await dispatch(updateVoucher({ id, updatedVoucher: data })).unwrap();
        setAlert({ message: 'Cập nhật giảm giá thành công!', type: 'success' });
      } else {
        await dispatch(createVoucher(data)).unwrap();
        setAlert({ message: 'Cập nhật giảm giá không thành công!', type: 'error' });
      }
      reset(); // Reset the form fields
      setTimeout(() => navigate('/admin/listVouchers'), 2000); // Navigate after 2 seconds
    } catch (error) {
      setAlert({ message: 'Error saving discount!', type: 'error' });
      console.error('Error saving discount:', error);
    }
  };;

  return (
    <main className="w-full flex-grow p-6">
      <div className="flex flex-wrap">
        <div className="w-full mt-6 pl-0 lg:pl-2">
          {alert && (
            <div className="mb-4">
              <AlertCustomStyles message={alert.message} type={alert.type} />
            </div>
          )}
          <div className="leading-loose">
            <form >
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Mã giảm giá
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    {...register('code', {
                      required: "Mã giảm giá không được để trống",
                      pattern: {
                        value: /^VOUS\d{4}$/,
                        message: "Mã giảm giá có dạng `VOUS1024`"
                      }
                    })}
                  />
                  {errors.code && typeof errors.code.message === 'string' && (
                    <p className="text-red-500 text-xs">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Phần trăm giảm giá
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="number"
                    {...register('voucherNum', {
                      required: "Phần trăm giảm giá không được để trống",
                      min: { value: 10.000, message: "Giá giảm phải lớn hơn 10.000" },
                    })}
                  />
                  {errors. voucherNum && typeof errors. voucherNum.message === 'string' && (
                    <p className="text-red-500 text-xs">{errors.voucherNum.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Danh mục sẵn sàng
                  </label>
                  <div className="relative">
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      {...register('cateReady', { required: "Danh mục không được để trống" })}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                    {errors.cateReady && typeof errors.cateReady.message === 'string' && (
                      <p className="text-red-500 text-xs">{errors.cateReady.message}</p>
                    )}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Hạn sử dụng
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="date"
                    {...register('expiryDate', {
                      required: "Expiration date is required",
                      validate: validateExpirationDate
                    })}
                  />
                  {errors.expiryDate && typeof errors.expiryDate.message === 'string' && (
                    <p className="text-red-500 text-xs">{errors.expiryDate.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Mô tả
                  </label>
                  <textarea
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    {...register('conditionActive', { required: "Mô tả không được để trống" })}
                  />
                  {errors.conditionActive && typeof errors.conditionActive.message === 'string' && (
                    <p className="text-red-500 text-xs">{errors.conditionActive.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button type="submit"
                 className="px-4 py-1 text-white font-light 
                 tracking-wider bg-gray-900 rounded"onClick={handleSubmit(onSubmit)}
                 >{ 'Cập nhật' }</button>
                <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="button">
                  <a href="/admin/listVouchers">Danh sách</a>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditDiscount;
