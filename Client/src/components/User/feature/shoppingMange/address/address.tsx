import { useAppDispatch, useAppSelector } from "../../../../../redux/store";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../../../redux/country/province";
import { Address } from "../../../../../types/user";
import {
  addAddressThunk,
  fetchAddressListThunk,
} from "../../../../../redux/auth/authThunk";

import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { Button } from "@nextui-org/react";

interface AddressSelectorProps {
  address: string | null;
  onBack: () => void;
  onAddressChange: (
    address: string,
    addressID: { provinceId: string; districtId: string; wardId: string }
  ) => void;
  profile: Address | null;
}

const CountrySelector: React.FC<AddressSelectorProps> = ({
  address,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const provinces = useAppSelector((state) => state.country.provinces) || [];
  const districts = useAppSelector((state) => state.country.districts) || [];
  const wards = useAppSelector((state) => state.country.wards) || [];

  const {
    handleSubmit,
    control,
    watch,
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

  // useEffect(() => {
  //   dispatch(fetchProvinces());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (address) {
  //     const [house, ward, district, province] = address
  //       .split(",")
  //       .map((part) => part.trim());
  //     setValue("houseNumber", house || "");
  //     setValue("province", province || "");
  //     setValue("district", district || "");
  //     setValue("ward", ward || "");
  //   } else {
  //     // Xử lý trường hợp address là null
  //     setValue("houseNumber", "");
  //     setValue("province", "");
  //     setValue("district", "");
  //     setValue("ward", "");
  //   }
  // }, [address, setValue]);
  // Fetch provinces on component mount
  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Fetch districts when province changes
  useEffect(() => {
    const provinceId = watch("province");
    if (provinceId) {
      dispatch(fetchDistricts(provinceId));
    }
  }, [watch("province"), dispatch]);

  // Fetch wards when district changes
  useEffect(() => {
    const districtId = watch("district");
    if (districtId) {
      dispatch(fetchWards(districtId));
    }
  }, [watch("district"), dispatch]);

  // Populate form if address exists
  useEffect(() => {
    if (address) {
      const [house, ward, district, province] = address
        .split(",")
        .map((part) => part.trim());
      setValue("houseNumber", house || "");
      setValue("province", province || "");
      setValue("district", district || "");
      setValue("ward", ward || "");
    }
  }, [address, setValue]);
  const onSubmit = async (data: any) => {
    try {
      const provinceName =
        provinces.find((p) => p.id === data.province)?.full_name || "";
      const districtName =
        districts.find((d) => d.id === data.district)?.full_name || "";
      const wardName = wards.find((w) => w.id === data.ward)?.full_name || "";

      // const addressString =
      //   `${data.houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();
      const addressString =
        `${data.houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();
      console.log("Address String for Server:", addressString);

      const addressData: Address = {
        address: addressString,
        addressID: JSON.stringify({
          provinceId: data.province,
          districtId: data.district,
          wardId: data.ward,
        }),
        fullName: data.fullName,
        phone: data.phone,
      };
      const response = await dispatch(addAddressThunk(addressData)).unwrap();
      await dispatch(fetchAddressListThunk());
      toast.dismiss();
      const successMessage = response?.message || "Thêm địa chỉ thành công!";
      onBack();
      toast.success(successMessage);
    } catch (error) {
      console.error("error", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : "Registration failed. Please try again.";
      toast.dismiss();
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Họ Tên */}

        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            <span className="text-red-500">{errors.fullName.message}</span>
          )}
        </div>

        {/* Số điện thoại */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            <span className="text-red-500">{errors.phone.message}</span>
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

        {/* Tỉnh Thành */}
        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            <span className="text-red-500">{errors.province.message}</span>
          )}
        </div>

        {/* Quận Huyện */}
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            <span className="text-red-500">{errors.district.message}</span>
          )}
        </div>

        {/* Phường Xã */}
        <div>
          <label
            htmlFor="ward"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            <span className="text-red-500">{errors.ward.message}</span>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Thêm địa chỉ
        </Button>

        <ToastContainer />
      </form>
      <button className="mt-6" color="gray" onClick={onBack}>
        Quay lại danh sách địa chỉ
      </button>
    </div>
  );
};

export default CountrySelector;
