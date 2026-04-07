import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState, AppDispatch } from "../../../../../../redux/store";
import { getAllServices } from "../../../../../../redux/servicesRef/serviceRefThunk";
import { DeleteOrderItearacRequest } from "../../../../../../types/iterationOrder/softDeleteForUser";

import { deleteOrderThunk } from "../../../../../../redux/statusOrderUser/MailSoftOrder/mailSoftOrderThunk";
import { Service } from "../../../../../../types/bidding/bidding";
import {   toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface DeleteBidModalProps {
  orderId:string ;
  onClose: () => void;

  isOpen: boolean;
}

interface FormValues {
  selectedService: string;
  reason: string;
  notes: string;
}

const DeleteOrderModal: React.FC<DeleteBidModalProps> = ({
  orderId,
  onClose,

  isOpen,
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
  const dispatch = useDispatch<AppDispatch>();
  const { services, loading } = useSelector((state: RootState) => state.serviceRef);
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  const selectedServiceId = watch("selectedService");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!userId) {
      console.error("Đăng nhập để xóa.");
      return;
    }

    if (!selectedServiceId) {
      console.error("Làm ơn chọn dịch vụ của bạn.");
      return;
    }

    const deleteRequest: DeleteOrderItearacRequest = {
      userId: userId,
      orderId: orderId,
      serviceRequestId: selectedServiceId,
      reason: data.reason,
      notes: data.notes,
    };


    dispatch(deleteOrderThunk(deleteRequest));
    toast.success("Mail được gửi thành công");
  // Call onDelete instead of onConfirm
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-10"
    >
      <div className="relative w-90 p-4 bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Xóa
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="selectedService"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Dịch vụ
                </label>
                <select
                  id="selectedService"
                  {...register("selectedService", { required: "Chọn dịch vụ" })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    services.map((service: Service) => (
                      <option key={service._id} value={service._id}>
                        {service.service_name}
                      </option>
                    ))
                  )}
                </select>
                {errors.selectedService && (
                  <p className="text-red-500 text-sm">{errors.selectedService.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Lý do
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="reason-high-price"
                    {...register("reason")}
                    value="Giá quá cao"
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="reason-high-price"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Giá quá cao
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="reason-wrong-purchase"
                    {...register("reason")}
                    value="Mua nhầm"
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="reason-wrong-purchase"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mua nhầm
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="reason-other"
                    {...register("reason")}
                    value="Lý do khác"
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="reason-other"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Lý do khác
                  </label>
                </div>
              </div>
            </div>
            <br />
            <div className="sm:col-span-2">
        <label
          htmlFor="notes"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Ghi chú
        </label>
        <textarea
          id="notes"
          rows={4}
          {...register('notes', { required: 'Ghi chú không được bỏ trống' })} // Directly setting required validation
          className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
            errors.notes ? 'border-red-500' : 'border-gray-300'
          } focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
        />
        {errors.notes && (
          <span className="text-red-500 text-sm">{errors.notes.message}</span>
        )}
      </div>
            <br />
            <div className="flex gap-4 items-center justify-end">
              <button
                type="submit"
                className="text-white bg-red-600 hover:bg-red-700 rounded-lg 
                text-sm px-5 py-2.5 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Hoàn trả
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default DeleteOrderModal;
