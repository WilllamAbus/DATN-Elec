import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, notifyError } from "../../productV2/toast/msgtoast";
import ReusableBreadcrumb from "../../../../../ultils/breadcrumb/admin/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../../ultils/breadcrumb/admin/breadcrumbData";
import { Screen, ResponseScreen } from "../../../../../services/attribute/types/screen/addScreen";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { addScreenThunk } from "../../../../../redux/attribute/thunk";
import FormInput from "../form/formInput";
import CKEditorComponent from "../customEditor/ckeditor";
const addScreen: React.FC = () => {

  const { register, handleSubmit, control,watch,setValue, formState: { errors } } = useForm<Screen>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const submitFormAdd: SubmitHandler<Screen> = async (data) => {
    setIsLoading(true);
    try {

      const actionResult = await dispatch(
        addScreenThunk(data)
      ).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/list-screen");
      }, 2000);
    } catch (error) {
      notifyError((error as ResponseScreen).msg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addScreen} />
      <div className="m-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm loại màn hình
        
        </h1>
          </div>
        </div>
        <div className="m-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="grid grid-cols-1 px-4 pt-4 xl:grid-cols-2 xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4  2xl:col-span-2 ">
         
            <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-6">
                <FormInput
                  id="name"
                  label="Tên loại màn hình"
                  placeholder="Nhập loại màn hình"
                  register={register}
                  control={control}
                  error={errors.name}
                  validation={{ required: "Tên loại màn hình là bắt buộc" }}
                />
              </div>
              

              <div className="col-span-6 1sm:col-span-3 mb-4">
                <CKEditorComponent
                  name="description"
                  value={watch("description")} 
                  onChange={(data) => setValue("description", data)}
                />

              </div>

            </div>


            <div className="col-span-6 sm:col-full">
              <button
                type="submit"
                className={`text-white bg-blue-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Đang thêm...
                  </div>
                ) : (
                  "Thêm loại màn hình"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    
        </div>
   
    </form>
  );
};

export default addScreen;
