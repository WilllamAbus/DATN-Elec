// import { useAppDispatch, useAppSelector } from "../../../../../redux/store";
// import {
//   fetchProvinces,
//   fetchDistricts,
//   fetchWards,
// } from "../../../../../redux/country/province";
// import { Address } from "../../../../../types/user";
// import {
//   addAddressThunk,
//   fetchAddressListThunk,
//   editAddressThunk, // Nhập thunk để cập nhật địa chỉ
// } from "../../../../../redux/auth/authThunk";

// import { useForm, Controller } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useEffect } from "react";

// interface AddressSelectorProps {
//   address: string | null;
//   onBack: () => void;
//   onAddressChange: (
//     address: string,
//     addressID: { provinceId: string; districtId: string; wardId: string }
//   ) => void;
//   profile: Address | null;
//   isEditing?: boolean; // Thêm prop để xác định nếu đang chỉnh sửa
// }

// const CountrySelector: React.FC<AddressSelectorProps> = ({
//   address,
//   onBack,
//   isEditing = false, // Mặc định là không chỉnh sửa
//   profile, // Nhận địa chỉ người dùng
// }) => {
//   const dispatch = useAppDispatch();
//   const provinces = useAppSelector((state) => state.country.provinces) || [];
//   const districts = useAppSelector((state) => state.country.districts) || [];
//   const wards = useAppSelector((state) => state.country.wards) || [];

//   const {
//     handleSubmit,
//     control,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       houseNumber: profile?.address.split(",")[0] || "",
//       province: profile?.addressID?.provinceId || "",
//       district: profile?.addressID?.districtId || "",
//       ward: profile?.addressID?.wardId || "",
//       fullName: profile?.fullName || "",
//       phone: profile?.phone || "",
//     },
//   });

//   useEffect(() => {
//     dispatch(fetchProvinces());
//   }, [dispatch]);

//   useEffect(() => {
//     if (address) {
//       const [house, ward, district, province] = address
//         .split(",")
//         .map((part) => part.trim());
//       setValue("houseNumber", house || "");
//       setValue("province", province || "");
//       setValue("district", district || "");
//       setValue("ward", ward || "");
//     } else {
//       // Xử lý trường hợp address là null
//       setValue("houseNumber", "");
//       setValue("province", "");
//       setValue("district", "");
//       setValue("ward", "");
//     }
//   }, [address, setValue]);

//   const onSubmit = async (data: any) => {
//     try {
//       const provinceName =
//         provinces.find((p) => p.province_id === data.province)?.province_name ||
//         "";
//       const districtName =
//         districts.find((d) => d.district_id === data.district)?.district_name ||
//         "";
//       const wardName =
//         wards.find((w) => w.ward_id === data.ward)?.ward_name || "";

//       const addressString =
//         `${data.houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();

//       console.log("Address String for Server:", addressString);

//       const addressData: Address = {
//         address: addressString,
//         addressID: JSON.stringify({
//           provinceId: data.province,
//           districtId: data.district,
//           wardId: data.ward,
//         }),
//         fullName: data.fullName,
//         phone: data.phone,
//       };

//       // Kiểm tra nếu đang chỉnh sửa hay thêm mới
//       const response = isEditing
//         ? await dispatch(
//             editAddressThunk({ id: address?.id, addressData })
//           ).unwrap()
//         : await dispatch(addAddressThunk(addressData)).unwrap();

//       await dispatch(fetchAddressListThunk());
//       toast.dismiss();
//       const successMessage =
//         response?.message ||
//         (isEditing ? "Cập nhật địa chỉ thành công!" : "Đăng ký thành công!");
//       toast.success(successMessage);
//     } catch (error) {
//       console.error("error", error);
//       const errorMessage =
//         typeof error === "string"
//           ? error
//           : "Cập nhật thất bại. Vui lòng thử lại.";
//       toast.dismiss();
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {/* Họ Tên */}
//         <div>
//           <label
//             htmlFor="fullName"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Họ và Tên
//           </label>
//           <Controller
//             name="fullName"
//             control={control}
//             rules={{ required: "Vui lòng nhập họ và tên" }}
//             render={({ field }) => (
//               <input
//                 {...field}
//                 type="text"
//                 id="fullName"
//                 className={`form-input mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.fullName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 aria-label="Họ và tên"
//               />
//             )}
//           />
//           {errors.fullName && (
//             <span className="text-red-500">{errors.fullName.message}</span>
//           )}
//         </div>

//         {/* Số điện thoại */}
//         <div>
//           <label
//             htmlFor="phone"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Số điện thoại
//           </label>
//           <Controller
//             name="phone"
//             control={control}
//             rules={{
//               required: "Vui lòng nhập số điện thoại",
//               pattern: {
//                 value: /^[0-9]{10,11}$/,
//                 message: "Số điện thoại không hợp lệ",
//               },
//             }}
//             render={({ field }) => (
//               <input
//                 {...field}
//                 type="text"
//                 id="phone"
//                 className={`form-input mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.phone ? "border-red-500" : "border-gray-300"
//                 }`}
//                 aria-label="Số điện thoại"
//               />
//             )}
//           />
//           {errors.phone && (
//             <span className="text-red-500">{errors.phone.message}</span>
//           )}
//         </div>

//         {/* Số Nhà */}
//         <div>
//           <label
//             htmlFor="houseNumber"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Số Nhà
//           </label>
//           <Controller
//             name="houseNumber"
//             control={control}
//             rules={{ required: "Vui lòng nhập số nhà" }}
//             render={({ field }) => (
//               <input
//                 {...field}
//                 type="text"
//                 id="houseNumber"
//                 className={`form-input mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.houseNumber ? "border-red-500" : "border-gray-300"
//                 }`}
//                 aria-label="Số nhà"
//               />
//             )}
//           />
//           {errors.houseNumber && (
//             <span className="text-red-500">{errors.houseNumber.message}</span>
//           )}
//         </div>

//         {/* Tỉnh Thành */}
//         <div>
//           <label
//             htmlFor="province"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Tỉnh Thành
//           </label>
//           <Controller
//             name="province"
//             control={control}
//             rules={{ required: "Vui lòng chọn tỉnh" }}
//             render={({ field }) => (
//               <select
//                 {...field}
//                 id="province"
//                 className={`form-select mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.province ? "border-red-500" : "border-gray-300"
//                 }`}
//                 onChange={(e) => {
//                   field.onChange(e);
//                   dispatch(fetchDistricts(e.target.value));
//                 }}
//               >
//                 <option value="">Chọn tỉnh</option>
//                 {provinces.map((p) => (
//                   <option key={p.province_id} value={p.province_id}>
//                     {p.province_name}
//                   </option>
//                 ))}
//               </select>
//             )}
//           />
//           {errors.province && (
//             <span className="text-red-500">{errors.province.message}</span>
//           )}
//         </div>

//         {/* Quận Huyện */}
//         <div>
//           <label
//             htmlFor="district"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Quận Huyện
//           </label>
//           <Controller
//             name="district"
//             control={control}
//             rules={{ required: "Vui lòng chọn quận" }}
//             render={({ field }) => (
//               <select
//                 {...field}
//                 id="district"
//                 className={`form-select mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.district ? "border-red-500" : "border-gray-300"
//                 }`}
//                 onChange={(e) => {
//                   field.onChange(e);
//                   dispatch(fetchWards(e.target.value));
//                 }}
//               >
//                 <option value="">Chọn quận</option>
//                 {districts.map((d) => (
//                   <option key={d.district_id} value={d.district_id}>
//                     {d.district_name}
//                   </option>
//                 ))}
//               </select>
//             )}
//           />
//           {errors.district && (
//             <span className="text-red-500">{errors.district.message}</span>
//           )}
//         </div>

//         {/* Phường Xã */}
//         <div>
//           <label
//             htmlFor="ward"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Phường Xã
//           </label>
//           <Controller
//             name="ward"
//             control={control}
//             rules={{ required: "Vui lòng chọn phường" }}
//             render={({ field }) => (
//               <select
//                 {...field}
//                 id="ward"
//                 className={`form-select mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.ward ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Chọn phường</option>
//                 {wards.map((w) => (
//                   <option key={w.ward_id} value={w.ward_id}>
//                     {w.ward_name}
//                   </option>
//                 ))}
//               </select>
//             )}
//           />
//           {errors.ward && (
//             <span className="text-red-500">{errors.ward.message}</span>
//           )}
//         </div>

//         <div className="flex justify-between mt-4">
//           <button
//             type="button"
//             onClick={onBack}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
//           >
//             Quay lại
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             {isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
//           </button>
//         </div>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default CountrySelector;
