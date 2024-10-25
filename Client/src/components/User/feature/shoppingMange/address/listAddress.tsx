import { RootState, useAppDispatch } from "../../../../../redux/store";
import {
  fetchAddressListThunk,
  deleteAddressThunk,
} from "../../../../../redux/auth/authThunk";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Address } from "../../../../../types/user";
import CountrySelector from "./address"; // Giả sử component này là nơi bạn chọn địa chỉ

const ListAddress: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addresses } = useSelector((state: RootState) => state.auth);
  const [addressAdd, setAddressAdd] = useState<Address | null>(null); // Sửa thành addressAdd
  console.log(addresses);

  useEffect(() => {
    dispatch(fetchAddressListThunk());
  }, [dispatch]);
  const handleDelete = (address: Address) => {
    if (address._id) {
      // Kiểm tra nếu _id có giá trị
      dispatch(deleteAddressThunk({ _id: address._id }));
    } else {
      console.error("Address ID is undefined"); // Xử lý khi _id không có giá trị
    }
  };

  const handleBackToList = () => {
    setAddressAdd(null); // Khi quay lại danh sách địa chỉ
  };

  const handleAddAddress = () => {
    setAddressAdd({} as Address); // Thiết lập giá trị rỗng để hiển thị form thêm địa chỉ
  };
  const handleAddressChange = (
    address: string,
    addressID: { provinceId: string; districtId: string; wardId: string }
  ) => {
    setAddressAdd({
      address: address,
      addressID: JSON.stringify(addressID), // Chuyển đổi đối tượng thành chuỗi JSON
      fullName: addressAdd?.fullName || "", // Hoặc giá trị mặc định khác
      phone: addressAdd?.phone || "", // Hoặc giá trị mặc định khác
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {addressAdd ? ( // Kiểm tra giá trị của addressAdd
        <CountrySelector
          address={addressAdd?.address || null} // Truyền address đúng theo prop
          onBack={handleBackToList}
          onAddressChange={handleAddressChange} // Cung cấp hàm này
          profile={null} // Hoặc cung cấp đối tượng profile nếu có
        />
      ) : (
        <>
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            Danh sách địa chỉ
          </h1>
          <ul className="space-y-4">
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((address) => (
                <li
                  key={address?.addressID} // Dùng optional chaining để phòng ngừa trường hợp address là null
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-base">
                    <p className="font-bold text-gray-900 text-lg">
                      {address?.fullName || "Không có tên"}{" "}
                      {/* Sử dụng default fallback nếu fullName bị null */}
                    </p>
                    <p className="flex items-center text-gray-600 mt-1">
                      <span className="font-medium text-gray-700 mr-2">
                        Địa chỉ:
                      </span>
                      {address?.address || "Không có địa chỉ"}{" "}
                      {/* Thêm fallback cho address */}
                    </p>
                    <p className="flex items-center text-gray-600 mt-1">
                      <span className="font-medium text-gray-700 mr-2">
                        Số điện thoại:
                      </span>
                      {address?.phone || "Không có số điện thoại"}{" "}
                      {/* Thêm fallback cho phone */}
                    </p>
                  </div>
                  <div>
                    <button className="text-blue-500 hover:underline">
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(address)}
                      className="ml-4 text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">
                Không có địa chỉ nào để hiển thị.
              </li>
            )}
          </ul>

          <div className="mt-6 flex justify-center w-full">
            <button
              onClick={handleAddAddress} // Thêm địa chỉ khi nhấn
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
            >
              Thêm địa chỉ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListAddress;
