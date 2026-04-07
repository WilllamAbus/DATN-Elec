import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { notify, notifyError } from "./toast/msgtoast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, type RootState } from "../../../../redux/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOneImageVariantThunk,editImageVariantThunk } from "../../../../redux/product/admin/Thunk";
import { breadcrumbItems, ReusableBreadcrumb } from "../../../../ultils/breadcrumb/admin";
import { ImageVariant } from "../../../../services/product_v2/admin/types/imageVariant";
import { Color } from "../../../../services/product_v2/types/attributes/getAllColor";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import ColorImageVariantSingle from "./selectVariant/colorImageVariantSingle";

import {
  handleColorImageVariantChange,
} from "./handlersVariant/colorImageVariantSingle";
import { SingleValue } from "react-select";
import { Card, CardBody } from "@nextui-org/react";
const EditImageVariant: React.FC = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageVariant>({});
  const navigate = useNavigate();
  const { imageId } = useParams<{ imageId: string }>();
  const imageIdString = imageId ?? "";
  const dispatch: AppDispatch = useDispatch();
  const imageVariant = useSelector((state: RootState) => state.products.getOneImageVariant.imageVariant);
  const fetchStatus = useSelector((state: RootState) => state.products.getOneImageVariant.status);
  const [isLoading, setIsLoading] = useState(false);
  const { imgPreview, setImgPreview, handleImageChange } = useImageUpload();
  const [selectedColor, setSelectedColor] = useState<SingleValue<Color> | null>(null);
  const onColorChange = (selectedOption: SingleValue<Color> | null) => {
    handleColorImageVariantChange(selectedOption, setSelectedColor, setValue);
  };
  useEffect(() => {
    if (imageId) {
      dispatch(getOneImageVariantThunk({ imageId }));
    }
  }, [dispatch, imageId]);
  useEffect(() => {
    if (imageVariant) {
      if (imageVariant.image && imageVariant.image.length > 0) {
        setImgPreview(imageVariant.image[0]);
      }
    }
  }, [imageVariant, setImgPreview, setValue]);
  useEffect(() => {
    if (fetchStatus === "success" && imageVariant) {
      setValue("color", imageVariant.color?.name ?? "");
    }
  }, [fetchStatus, imageVariant, setValue]);

  const submitFormEdit: SubmitHandler<ImageVariant> = async (data) => {
    setIsLoading(true);

    try {
      const actionResult = await dispatch(
        editImageVariantThunk({ imageVariantId: imageIdString, imageVariant: data, })
      ).unwrap();
      notify(actionResult.msg);
      setTimeout(() => {
        navigate("/admin/list-image-and-color");
      }, 2000);
    } catch (error) {
      notifyError((error as { msg: string }).msg);
    }
  };
  return (
    <form  onSubmit={handleSubmit(submitFormEdit)} encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addCategories} />
      <div className="m-4 bg-white shadow-md overflow-hidden border rounded-lg border-gray-100 antialiased dark:bg-gray-900 md:py-4">
          <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Đang cập nhật hình ảnh cho {" "}
          <span className="text-blue-600">
            {imageVariant?.color?.name || "Không rõ màu"}
          </span>
        </h1>
          </div>
        </div>
      <Card className='m-4' >
        <CardBody>
          <div className="grid grid-cols-[1fr_1fr] px-4 pt-4 xl:grid-cols-[1fr_1fr] xl:gap-4 dark:bg-gray-900">
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                  {imgPreview && (
                    <div className="mb-4 rounded-lg w-24 h-24 sm:mb-0 xl:mb-4 2xl:mb-0">
                      <img src={imgPreview} alt="Image Preview" />
                    </div>
                  )}
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Hình ảnh</h3>
                    <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      JPG, GIF hoặc PNG. Kích thước tối đa 2MB
                    </div>

                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        multiple
                        id="image"
                        {...register("image")}
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan sản phẩm</h3>

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
                  "Thêm sản phẩm"
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

export default EditImageVariant;
