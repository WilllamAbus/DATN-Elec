import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { notify, notifyError } from "./toast/msgtoast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addImageVariantThunk } from "../../../../redux/product/admin/Thunk";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import { ImageVariant } from "../../../../services/product_v2/admin/types/imageVariant";
import { Color } from "../../../../services/product_v2/types/attributes/getAllColor";
import { useImageUpload } from "./hook/useImageUpload";
import ColorImageVariantSingle from "./selectVariant/colorImageVariantSingle";

import {
  handleColorImageVariantChange,
} from "./handlersVariant/colorImageVariantSingle";
import { SingleValue } from "react-select";
import { Card, CardBody } from "@nextui-org/react";
import ImageUpload from "./Form/formImage";
const AddImageVariant: React.FC = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageVariant>({});
  const navigate = useNavigate();

  const { product_variant_id } = useParams<{ product_variant_id: string }>();
  const productVariantIdString = product_variant_id ?? "";
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { imgPreviews, handleImageChange, error } = useImageUpload();
  
  const [selectedColor, setSelectedColor] = useState<SingleValue<Color> | null>(null);
  const onColorChange = (selectedOption: SingleValue<Color> | null) => {
    handleColorImageVariantChange(selectedOption, setSelectedColor, setValue);
  };
  const submitFormAdd: SubmitHandler<ImageVariant> = async (data) => {
    setIsLoading(true);

    try {
      const actionResult = await dispatch(
        addImageVariantThunk({ product_variant_id: productVariantIdString, imageVariant: data })
      ).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/add-post-product");
      }, 2000);
    } catch (error) {
      notifyError((error as { msg: string }).msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitFormAdd)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addCategories} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm hình ảnh cho biến thể
        </h1>
      </div>
      <Card className='m-4 shadow-none bg-white border border-gray-100 rounded-lg'>
        <CardBody>
          <div className="grid grid-cols-1 px-4 pt-4 gap-4 dark:bg-gray-900">
            <div className="col-span-full xl:col-auto">
              <div className="col-span-6 sm:col-span-6">
              <ImageUpload
                  imgPreviews={imgPreviews}
                  handleImageChange={handleImageChange}
                  register={register}
                  errors={(errors.image?.message as string) || error.join(", ")}
                  validation={{ required: "vui lòng chọn ảnh" }}
                />
              </div>

            </div>
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">

                <div className="grid grid-cols-1 gap-6">
                  <div className="col-span-3 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Màu sắc
                    </label>
                    <ColorImageVariantSingle
                      value={selectedColor}
                      onChange={onColorChange}
                    />
                    {errors.color && (
                      <span className="text-red-600">
                        {errors.color.message?.toString()}
                      </span>
                    )}
                  </div>

                </div>

              </div>
            </div>
            <div className="col-span-full mt-4 sm:col-full flex space-x-4 justify-end ">
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
                  "Thêm ảnh cho biến thể"
                )}
              </button>
              <Link
                to="/admin/listproduct"
                className="text-white bg-emerald-700 hover:bg-lime-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Danh sách
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

    </form>
  );
};

export default AddImageVariant;
