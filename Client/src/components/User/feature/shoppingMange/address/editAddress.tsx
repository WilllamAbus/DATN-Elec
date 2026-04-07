import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  editAddressThunk,
  fetchAddressByIdThunk,
  fetchAddressListThunk,
} from "../../../../../redux/auth/authThunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "../../../../../redux/store";
import {
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "../../../../../redux/country/province";
import { Address } from "../../../../../types/user";
import { Button } from "@nextui-org/react";

interface EditAddressProps {
  addressId: string;
  onBack: () => void;
}

const EditAddress: React.FC<EditAddressProps> = ({ addressId, onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const provinces =
    useSelector((state: RootState) => state.country.provinces) || [];
  const districts =
    useSelector((state: RootState) => state.country.districts) || [];
  const wards = useSelector((state: RootState) => state.country.wards) || [];
  const { selectedAddress, status } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      houseNumber: "",
      province: "",
      district: "",
      ward: "",
      fullName: "",
      phone: "",
    },
  });

  useEffect(() => {
    dispatch(fetchProvinces()); // Lấy danh sách tỉnh
  }, [dispatch]);
  useEffect(() => {
    if (addressId) {
      dispatch(fetchAddressByIdThunk(addressId))
        .unwrap()
        .catch(() => {
          toast.error("Không thể tải dữ liệu địa chỉ.");
        });
    }
  }, [addressId, dispatch]);
  useEffect(() => {
    if (selectedAddress && selectedAddress.address) {
      const [house, ward, district, province] = selectedAddress.address
        .split(",")
        .map((part) => part.trim());
      setValue("houseNumber", house || "");
      setValue("province", province || "");
      setValue("district", district || "");
      setValue("ward", ward || "");
    } else {
      // Xử lý trường hợp address là null
      setValue("houseNumber", "");
      setValue("province", "");
      setValue("district", "");
      setValue("ward", "");
    }
  }, [selectedAddress, setValue]);
  useEffect(() => {
    if (selectedAddress) {
      setValue("fullName", selectedAddress.fullName || "");
      setValue("phone", selectedAddress.phone || "");
      setValue("province", selectedAddress.addressID || "");
      setValue("district", selectedAddress.addressID || "");
      setValue("ward", selectedAddress.addressID || "");
    }
  }, [selectedAddress, setValue]);
  const onSubmit = async (data: any) => {
    try {
      const provinceName =
        provinces.find((p) => p.id === data.province)?.full_name || "";
      const districtName =
        districts.find((d) => d.id === data.district)?.full_name || "";
      const wardName = wards.find((w) => w.id === data.ward)?.full_name || "";

      const addressString =
        `${data.houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();

      console.log("Address String for Server:", addressString);

      const addressData: Address = {
        addressId: addressId,
        address: addressString,
        addressID: JSON.stringify({
          provinceId: data.province,
          districtId: data.district,
          wardId: data.ward,
        }),
        fullName: data.fullName,
        phone: data.phone,
      };

      // Gọi API chỉnh sửa địa chỉ
      const response = await dispatch(
        editAddressThunk({ addressData })
      ).unwrap();
      await dispatch(fetchAddressListThunk());
      toast.dismiss();
      const successMessage =
        response?.message || "Chỉnh sửa địa chỉ thành công!";
      onBack();
      toast.success(successMessage);
    } catch (error) {
      console.error("error", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : "Chỉnh sửa địa chỉ thất bại. Vui lòng thử lại.";
      toast.dismiss();
      toast.error(errorMessage);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Họ và Tên
          </label>
          <Controller
            name="fullName"
            control={control}
            rules={{ required: "Vui lòng nhập họ và tên" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="fullName"
                className={`form-input mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                aria-label="Họ và tên"
              />
            )}
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Số điện thoại
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="phone"
                className={`form-input mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                aria-label="Số điện thoại"
              />
            )}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>
        {/* Số Nhà */}
        <div>
          <label
            htmlFor="houseNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Số Nhà
          </label>
          <Controller
            name="houseNumber"
            control={control}
            rules={{ required: "Vui lòng nhập số nhà" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="houseNumber"
                className={`form-input mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.houseNumber ? "border-red-500" : "border-gray-300"
                }`}
                aria-label="Số nhà"
              />
            )}
          />
          {errors.houseNumber && (
            <span className="text-red-500">{errors.houseNumber.message}</span>
          )}
        </div>

        {/* Province */}
        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tỉnh Thành
          </label>
          <Controller
            name="province"
            control={control}
            rules={{ required: "Vui lòng chọn tỉnh" }}
            render={({ field }) => (
              <select
                {...field}
                id="province"
                className={`form-select mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.province ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(fetchDistricts(e.target.value));
                }}
              >
                <option value="">Chọn tỉnh</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.province && (
            <span className="text-red-500 text-sm">
              {errors.province.message}
            </span>
          )}
        </div>

        {/* District */}
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quận Huyện
          </label>
          <Controller
            name="district"
            control={control}
            rules={{ required: "Vui lòng chọn quận" }}
            render={({ field }) => (
              <select
                {...field}
                id="district"
                className={`form-select mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.district ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(fetchWards(e.target.value));
                }}
              >
                <option value="">Chọn quận</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.district && (
            <span className="text-red-500 text-sm">
              {errors.district.message}
            </span>
          )}
        </div>

        {/* Ward */}
        <div>
          <label
            htmlFor="ward"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phường Xã
          </label>
          <Controller
            name="ward"
            control={control}
            rules={{ required: "Vui lòng chọn phường" }}
            render={({ field }) => (
              <select
                {...field}
                id="ward"
                className={`form-select mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ward ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn phường</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.full_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.ward && (
            <span className="text-red-500 text-sm">{errors.ward.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Cập nhật địa chỉ
          </Button>
        </div>
        <Button className="text-gray-500 mt-6 underline" onClick={onBack}>
          Quay lại danh sách địa chỉ
        </Button>
      </form>
    </div>
  );
};

export default EditAddress;
