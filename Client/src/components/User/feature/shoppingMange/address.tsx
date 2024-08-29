import React, { useState, useEffect } from "react";
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

interface AddressSelectorProps {
  address: string | null; // Cần để hiển thị địa chỉ hiện tại
  onAddressChange: (address: string) => void;
  profile: UserProfile | null;
}

const CountrySelector: React.FC<AddressSelectorProps> = ({
  address,
  onAddressChange,
}) => {
  const dispatch = useAppDispatch();
  const provinces = useAppSelector((state) => state.country.provinces) || [];
  const districts = useAppSelector((state) => state.country.districts) || [];
  const wards = useAppSelector((state) => state.country.wards) || [];

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      const [ward, district, province] = address
        .split(",")
        .map((part) => part.trim());
      setSelectedWard(ward || "");
      setSelectedDistrict(district || "");
      setSelectedProvince(province || "");

      dispatch(fetchProvinces());
      if (province) {
        dispatch(fetchDistricts(province));
      }
      if (district) {
        dispatch(fetchWards(district));
      }
    } else {
      dispatch(fetchProvinces());
    }
  }, [address, dispatch]);

  useEffect(() => {
    if (selectedProvince) {
      dispatch(fetchDistricts(selectedProvince));
    }
  }, [selectedProvince, dispatch]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchWards(selectedDistrict));
    }
  }, [selectedDistrict, dispatch]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    const newAddress = `${value}`;
    onAddressChange(newAddress);
    if (value) {
      dispatch(fetchDistricts(value));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    setSelectedWard("");
    const newAddress = `${selectedProvince}, ${value}`;
    onAddressChange(newAddress);
    if (value) {
      dispatch(fetchWards(value));
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedWard(value);
    const newAddress = `${selectedProvince}, ${selectedDistrict}, ${value}`;
    onAddressChange(newAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append(
        "address",
        `${selectedWard}, ${selectedDistrict}, ${selectedProvince}`
      );

      await dispatch(updateProfileThunk(formData)).unwrap();

      const updatedProfile = await dispatch(getProfileThunk()).unwrap();
      dispatch(setProfile(updatedProfile));

      setMessage("Cập nhật địa chỉ thành công!");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.msg
          ? `Lỗi: ${err.response.status} - ${err.response.data.msg}`
          : "Đã xảy ra lỗi không xác định";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentAddress = `${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;

  return (
    <div className="space-y-4">
      {/* Số Nhà */}
      <div>
        <label
          htmlFor="houseNumber"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Số Nhà
        </label>
        <input
          type="text"
          name="houseNumber"
          id="houseNumber"
          value={address || ""}
          className="form-input mt-1 block w-full"
          aria-label="Địa chỉ hiện tại"
        />
      </div>

      {/* Tỉnh Thành */}
      <div>
        <label
          htmlFor="province"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tỉnh Thành
        </label>
        <select
          name="province"
          id="province"
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="form-select mt-1 block w-full"
          aria-label="Chọn tỉnh thành"
        >
          <option value="">Chọn tỉnh thành</option>
          {provinces.length > 0 ? (
            provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.full_name}
              </option>
            ))
          ) : (
            <option value="">Không có dữ liệu</option>
          )}
        </select>
      </div>

      {/* Quận Huyện */}
      <div>
        <label
          htmlFor="district"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Quận Huyện
        </label>
        <select
          name="district"
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="form-select mt-1 block w-full"
          aria-label="Chọn quận huyện"
        >
          <option value="">Chọn quận huyện</option>
          {districts.length > 0 ? (
            districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.full_name}
              </option>
            ))
          ) : (
            <option value="">Không có dữ liệu</option>
          )}
        </select>
      </div>

      {/* Phường Xã */}
      <div>
        <label
          htmlFor="ward"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phường Xã
        </label>
        <select
          name="ward"
          id="ward"
          value={selectedWard}
          onChange={handleWardChange}
          className="form-select mt-1 block w-full"
          aria-label="Chọn phường xã"
        >
          <option value="">Chọn phường xã</option>
          {wards.length > 0 ? (
            wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.full_name}
              </option>
            ))
          ) : (
            <option value="">Không có dữ liệu</option>
          )}
        </select>
      </div>

      {/* Địa chỉ hiện tại */}
      <div>
        <label
          htmlFor="currentAddress"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Địa chỉ hiện tại
        </label>
        <input
          type="text"
          name="currentAddress"
          id="currentAddress"
          value={currentAddress}
          readOnly
          className="form-input mt-1 block w-full"
          aria-label="Địa chỉ hiện tại"
        />
      </div>

      {/* Nút Cập Nhật */}
      <button
        type="button"
        onClick={handleSubmit}
        className={`mt-4 w-full py-3 px-4 text-center text-white font-semibold rounded-md transition duration-150 ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        }`}
        disabled={loading}
      >
        {loading ? "Đang cập nhật..." : "Cập Nhật Địa Chỉ"}
      </button>

      {/* Thông báo lỗi hoặc thành công */}
      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.includes("thành công") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CountrySelector;
