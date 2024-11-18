import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReusableBreadcrumb from "../../../../ultils/breadcrumb/ReusableBreadcrumb";
import { breadcrumbItems } from "../../../../ultils/breadcrumb/breadcrumbData";
import { ProductVariant } from "../../../../services/product_v2/admin/types/editVariant";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { getOneProductVariantThunk } from "../../../../redux/product/admin/Thunk";
import { RootState } from "../../../../redux/store";

const EditVariant: React.FC = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const dispatch: AppDispatch = useDispatch();

  const variant = useSelector((state: RootState) => state.products.getOneProductVariant.variant);
  console.log(variant);

  const {
    setValue,
    formState: { },
  } = useForm<ProductVariant>();

  useEffect(() => {
    if (variantId) {
      dispatch(getOneProductVariantThunk(variantId));

    }
  }, [dispatch, variantId]);

  useEffect(() => {
    if (variant) {
      setValue("variant_name", variant.variant_name);
      setValue("variant_description", variant.variant_description);
      setValue("variant_price", variant.variant_price);
      setValue("color", variant.color);

    }
  }, [variant, setValue]);
  console.log(variant);

  return (
    <form encType="multipart/form-data">
      <ToastContainer />
      <ReusableBreadcrumb items={breadcrumbItems.addVariant} />
      <div className="mb-4 ml-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Thêm biến thể sản phẩm
        </h1>
      </div>
      <div className="grid grid-cols-1 px-4 pt-4 xl:grid-cols-2 xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">Tổng quan sản phẩm</h3>

            {variant && (
              <Autocomplete
               variant="bordered"
                label="Chọn biến thể sản phẩm"
                placeholder="Tìm kiếm biến thể"
                defaultSelectedKey={variant.color[0]?._id}
                defaultItems={variant.color.map((color) => ({
                  label: color.name,
                  value: color._id,
                }))}
                className="max-w-xs"
                scrollShadowProps={{
                  isEnabled: false,
                }}
              >
                {(item: { label: string; value: string }) => (
                  <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
                )}
              </Autocomplete>
            )}



          </div>
        </div>
      </div>
    </form>
  );
};

export default EditVariant;
