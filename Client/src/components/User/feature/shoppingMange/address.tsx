// import React, { useState, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../../../redux/store";
// import {
//   fetchProvinces,
//   fetchDistricts,
//   fetchWards,
// } from "../../../../redux/country/province";
// import { UserProfile } from "../../../../types/user";
// import {
//   updateProfileThunk,
//   getProfileThunk,
// } from "../../../../redux/auth/authThunk";
// import { setProfile } from "../../../../redux/auth/authSlice";
// import axios from "axios";

// interface AddressSelectorProps {
//   address: string | null; // Địa chỉ hiện tại (full_name)
//   onAddressChange: (
//     address: string,
//     addressID: { provinceId: string; districtId: string; wardId: string }
//   ) => void;
//   profile: UserProfile | null;
// }

// const CountrySelector: React.FC<AddressSelectorProps> = ({
//   address,
//   onAddressChange,
// }) => {
//   const dispatch = useAppDispatch();
//   const provinces = useAppSelector((state) => state.country.provinces) || [];
//   const districts = useAppSelector((state) => state.country.districts) || [];
//   const wards = useAppSelector((state) => state.country.wards) || [];
//   const profile = useAppSelector((state) => state.auth.profile.profile) || [];

//   const [selectedProvince, setSelectedProvince] = useState<string>("");
//   const [selectedDistrict, setSelectedDistrict] = useState<string>("");
//   const [selectedWard, setSelectedWard] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     dispatch(fetchProvinces());
//   }, [dispatch]);

//   useEffect(() => {
//     if (address) {
//       const [ward, district, province] = address
//         .split(",")
//         .map((part) => part.trim());
//       setSelectedWard(ward || "");
//       setSelectedDistrict(district || "");
//       setSelectedProvince(province || "");
//     }
//   }, [address]);

//   useEffect(() => {
//     if (selectedProvince) {
//       dispatch(fetchDistricts(selectedProvince));
//     }
//   }, [selectedProvince, dispatch]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       dispatch(fetchWards(selectedDistrict));
//     }
//   }, [selectedDistrict, dispatch]);

//   const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedProvince(value);
//     setSelectedDistrict("");
//     setSelectedWard("");
//     const provinceName = provinces.find((p) => p.id === value)?.full_name || "";
//     const newAddress = `${provinceName}`;
//     onAddressChange(newAddress, {
//       provinceId: value,
//       districtId: "",
//       wardId: "",
//     });
//     if (value) {
//       dispatch(fetchDistricts(value));
//     }
//   };

//   const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedDistrict(value);
//     setSelectedWard("");
//     const districtName = districts.find((d) => d.id === value)?.full_name || "";
//     const newAddress = `${
//       selectedProvince
//         ? `${provinces.find((p) => p.id === selectedProvince)?.full_name}, `
//         : ""
//     }${districtName}`;
//     onAddressChange(newAddress, {
//       provinceId: selectedProvince,
//       districtId: value,
//       wardId: "",
//     });
//     if (value) {
//       dispatch(fetchWards(value));
//     }
//   };

//   const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedWard(value);

//     const wardName = wards.find((w) => w.id === value)?.full_name || "";
//     const districtName =
//       districts.find((d) => d.id === selectedDistrict)?.full_name || "";
//     const provinceName =
//       provinces.find((p) => p.id === selectedProvince)?.full_name || "";

//     const newAddress = `${wardName ? `${wardName}, ` : ""}${
//       districtName ? `${districtName}, ` : ""
//     }${provinceName}`;

//     onAddressChange(newAddress, {
//       provinceId: selectedProvince,
//       districtId: selectedDistrict,
//       wardId: value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       const provinceName =
//         provinces.find((p) => p.id === selectedProvince)?.full_name || "";
//       const districtName =
//         districts.find((d) => d.id === selectedDistrict)?.full_name || "";
//       const wardName =
//         wards.find((w) => w.id === selectedWard)?.full_name || "";
//       const addressString = `${wardName ? `${wardName}, ` : ""}${
//         districtName ? `${districtName}, ` : ""
//       }${provinceName}`;

//       const formData = new FormData();
//       formData.append("address", addressString); // Lưu địa chỉ dưới dạng full_name
//       formData.append(
//         "addressID",
//         JSON.stringify({
//           provinceId: selectedProvince,
//           districtId: selectedDistrict,
//           wardId: selectedWard,
//         })
//       ); // Lưu ID

//       await dispatch(updateProfileThunk(formData)).unwrap();

//       const updatedProfile = await dispatch(getProfileThunk()).unwrap();
//       dispatch(setProfile(updatedProfile));

//       setMessage("Cập nhật địa chỉ thành công!");
//     } catch (err) {
//       const errorMessage =
//         axios.isAxiosError(err) && err.response?.data?.msg
//           ? `Lỗi: ${err.response.status} - ${err.response.data.msg}`
//           : "Đã xảy ra lỗi không xác định";
//       setMessage(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const currentAddress = `${
//     wards.find((w) => w.id === selectedWard)?.full_name || ""
//   }, ${districts.find((d) => d.id === selectedDistrict)?.full_name || ""}, ${
//     provinces.find((p) => p.id === selectedProvince)?.full_name || ""
//   }`;

//   return (
//     <div className="space-y-4">
//       {/* Số Nhà */}
//       <div>
//         <label
//           htmlFor="houseNumber"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Số Nhà
//         </label>
//         <input
//           type="text"
//           name="houseNumber"
//           id="houseNumber"
//           value={address || ""}
//           className="form-input mt-1 block w-full"
//           aria-label="Địa chỉ hiện tại"
//         />
//       </div>

//       {/* Tỉnh Thành */}
//       <div>
//         <label
//           htmlFor="province"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Tỉnh Thành
//         </label>
//         <select
//           name="province"
//           id="province"
//           value={selectedProvince}
//           onChange={handleProvinceChange}
//           className="form-select mt-1 block w-full"
//           aria-label="Chọn tỉnh thành"
//         >
//           <option value="">Chọn tỉnh thành</option>
//           {provinces.length > 0 ? (
//             provinces.map((province) => (
//               <option key={province.id} value={province.id}>
//                 {province.full_name}
//               </option>
//             ))
//           ) : (
//             <option value="">Không có dữ liệu</option>
//           )}
//         </select>
//       </div>

//       {/* Quận Huyện */}
//       <div>
//         <label
//           htmlFor="district"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Quận Huyện
//         </label>
//         <select
//           name="district"
//           id="district"
//           value={selectedDistrict}
//           onChange={handleDistrictChange}
//           className="form-select mt-1 block w-full"
//           aria-label="Chọn quận huyện"
//         >
//           <option value="">Chọn quận huyện</option>
//           {districts.length > 0 ? (
//             districts.map((district) => (
//               <option key={district.id} value={district.id}>
//                 {district.full_name}
//               </option>
//             ))
//           ) : (
//             <option value="">Không có dữ liệu</option>
//           )}
//         </select>
//       </div>

//       {/* Phường Xã */}
//       <div>
//         <label
//           htmlFor="ward"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Phường Xã
//         </label>
//         <select
//           name="ward"
//           id="ward"
//           value={selectedWard}
//           onChange={handleWardChange}
//           className="form-select mt-1 block w-full"
//           aria-label="Chọn phường xã"
//         >
//           <option value="">Chọn phường xã</option>
//           {wards.length > 0 ? (
//             wards.map((ward) => (
//               <option key={ward.id} value={ward.id}>
//                 {ward.full_name}
//               </option>
//             ))
//           ) : (
//             <option value="">Không có dữ liệu</option>
//           )}
//         </select>
//       </div>

//       {/* Địa chỉ hiện tại */}
//       <div>
//         <label
//           htmlFor="currentAddress"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Địa chỉ hiện tại
//         </label>
//         <input
//           type="text"
//           name="currentAddress"
//           id="currentAddress"
//           value={currentAddress}
//           readOnly
//           className="form-input mt-1 block w-full"
//           aria-label="Địa chỉ hiện tại"
//         />
//       </div>

//       {/* Nút Cập Nhật */}
//       <button
//         type="button"
//         onClick={handleSubmit}
//         className={`mt-4 w-full py-3 px-4 text-center text-white font-semibold rounded-md transition duration-150 ${
//           loading
//             ? "bg-gray-500 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         }`}
//         disabled={loading}
//       >
//         {loading ? "Đang cập nhật..." : "Cập Nhật Địa Chỉ"}
//       </button>

//       {/* Thông báo lỗi hoặc thành công */}
//       {message && (
//         <p
//           className={`mt-4 text-sm font-medium ${
//             message.includes("thành công") ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default CountrySelector;

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../../redux/country/province";
import { UserProfile } from "../../../../types/user";
import {
  updateProfileThunk,
  getProfileThunk,
} from "../../../../redux/auth/authThunk";
import { setProfile } from "../../../../redux/auth/authSlice";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

interface AddressSelectorProps {
  address: string | null;
  onAddressChange: (
    address: string,
    addressID: { provinceId: string; districtId: string; wardId: string }
  ) => void;
  profile: UserProfile | null;
}

const CountrySelector: React.FC<AddressSelectorProps> = ({ address }) => {
  const dispatch = useAppDispatch();
  const provinces = useAppSelector((state) => state.country.provinces) || [];
  const districts = useAppSelector((state) => state.country.districts) || [];
  const wards = useAppSelector((state) => state.country.wards) || [];
  const fullAddress =
    useAppSelector((state) => state.auth.profile.profile?.address) || "";

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
    },
  });

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

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

      const addressString =
        `${data.houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();
      console.log("Address String for Server:", addressString);

      const formData = new FormData();
      formData.append("address", addressString);
      formData.append(
        "addressID",
        JSON.stringify({
          provinceId: data.province,
          districtId: data.district,
          wardId: data.ward,
        })
      );

      await dispatch(updateProfileThunk(formData)).unwrap();

      const updatedProfile = await dispatch(getProfileThunk()).unwrap();
      dispatch(setProfile(updatedProfile));
      alert("Cập nhật địa chỉ thành công!");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.msg
          ? `Lỗi: ${err.response.status} - ${err.response.data.msg}`
          : "Đã xảy ra lỗi không xác định";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              className={`form-input mt-1 block w-full ${
                errors.houseNumber ? "border-red-500" : ""
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
          rules={{ required: "Vui lòng chọn tỉnh thành" }}
          render={({ field }) => (
            <select
              {...field}
              id="province"
              className={`form-select mt-1 block w-full ${
                errors.province ? "border-red-500" : ""
              }`}
              aria-label="Chọn tỉnh thành"
              onChange={(e) => {
                field.onChange(e);
                dispatch(fetchDistricts(e.target.value));
              }}
            >
              <option value="">Chọn tỉnh thành</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.full_name}
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
          rules={{ required: "Vui lòng chọn quận huyện" }}
          render={({ field }) => (
            <select
              {...field}
              id="district"
              className={`form-select mt-1 block w-full ${
                errors.district ? "border-red-500" : ""
              }`}
              aria-label="Chọn quận huyện"
              onChange={(e) => {
                field.onChange(e);
                dispatch(fetchWards(e.target.value));
              }}
            >
              <option value="">Chọn quận huyện</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.full_name}
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
          rules={{ required: "Vui lòng chọn phường xã" }}
          render={({ field }) => (
            <select
              {...field}
              id="ward"
              className={`form-select mt-1 block w-full ${
                errors.ward ? "border-red-500" : ""
              }`}
              aria-label="Chọn phường xã"
            >
              <option value="">Chọn phường xã</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.full_name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.ward && (
          <span className="text-red-500">{errors.ward.message}</span>
        )}
      </div>
      <div>
        <label
          htmlFor="fullAddress"
          className="block text-sm font-medium text-gray-700"
        >
          Địa chỉ đầy đủ
        </label>
        <input
          type="text"
          id="fullAddress"
          value={fullAddress}
          readOnly
          className="form-input mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Cập nhật địa chỉ
      </button>
    </form>
  );
};

export default CountrySelector;
