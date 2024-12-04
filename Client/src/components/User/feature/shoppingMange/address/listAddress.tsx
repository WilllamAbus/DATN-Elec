// import { RootState, useAppDispatch } from "../../../../../redux/store";
// import {
//   fetchAddressListThunk,
//   deleteAddressThunk,
//   setDefaultAddressThunk,
// } from "../../../../../redux/auth/authThunk";

// import Swal, { SweetAlertResult } from "sweetalert2";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Address } from "../../../../../types/user";
// import CountrySelector from "./address";

// const ListAddress: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { addresses } = useSelector((state: RootState) => state.auth);
//   const [addressAdd, setAddressAdd] = useState<Address | null>(null);

//   console.log(addresses);
//   useEffect(() => {
//     console.log("Updated addresses:", addresses);
//   }, [addresses]);

//   useEffect(() => {
//     dispatch(fetchAddressListThunk());
//   }, [dispatch]);
//   const handleDelete = (_id: string) => {
//     if (_id) {
//       Swal.fire({
//         title: "Xác nhận xóa địa chỉ",
//         text: "Bạn có chắc chắn muốn xóa địa chỉ này?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Xóa",
//         cancelButtonText: "Hủy",
//       }).then(async (result: SweetAlertResult) => {
//         if (result.isConfirmed) {
//           try {
//             const response = await dispatch(deleteAddressThunk(_id)).unwrap();

//             toast.dismiss();
//             const successMessage =
//               response?.message || "Xóa địa chỉ thành công!";
//             toast.success(successMessage);
//           } catch (error) {
//             console.error("Lỗi khóa TK:", error);

//             const errorMessage = (error as string) || "Không thể khóa.";
//             toast.dismiss();
//             toast.error(errorMessage);
//           }
//         }
//       });
//     } else {
//       console.error("Address ID is undefined");
//     }
//   };

//   const handleSetDefaultAddress = async (_id: string) => {
//     // setIsLoading(true);
//     try {
//       const response = await dispatch(setDefaultAddressThunk(_id)).unwrap();
//       await dispatch(fetchAddressListThunk());
//       toast.dismiss();
//       const successMessage =
//         response?.message || "Đặt làm địa chỉ mặc định thành công!";
//       toast.success(successMessage);
//     } catch (error) {
//       console.error("Lỗi khóa TK:", error);

//       const errorMessage = (error as string) || "Không thể khóa.";
//       toast.dismiss();
//       toast.error(errorMessage);
//     }
//   };

//   // const handleSetDefaultAddress = async (addressId: string | undefined) => {
//   //     if (addressId) {
//   //       setIsLoading(true); // Bắt đầu loading
//   //       try {
//   //         const response = await dispatch(setDefaultAddressThunk(addressId));

//   //         // Kiểm tra xem payload có tồn tại hay không
//   //         if (setDefaultAddressThunk.fulfilled.match(response)) {
//   //           const successMessage = response.payload.message;
//   //           toast.dismiss();
//   //           toast.success(successMessage);
//   //         }

//   //         await dispatch(fetchAddressListThunk());
//   //       } catch (error) {
//   //         if (setDefaultAddressThunk.rejected.match(error)) {
//   //           const errorMessage =
//   //             error.payload || "Có lỗi xảy ra khi thiết lập địa chỉ mặc định.";
//   //           toast.error(errorMessage);
//   //         } else {
//   //           const errorMessage =
//   //             (error as Error).message ||
//   //             "Có lỗi xảy ra khi thiết lập địa chỉ mặc định.";
//   //           toast.error(errorMessage);
//   //         }
//   //       } finally {
//   //         setIsLoading(false);
//   //       }
//   //     } else {
//   //       console.error("Address ID is undefined");
//   //     }
//   //   };
//   const handleBackToList = () => {
//     setAddressAdd(null);
//   };

//   const handleAddAddress = () => {
//     setAddressAdd({} as Address);
//   };
//   const handleAddressChange = (
//     address: string,
//     addressID: { provinceId: string; districtId: string; wardId: string }
//   ) => {
//     setAddressAdd({
//       address: address,
//       addressID: JSON.stringify(addressID),
//       fullName: addressAdd?.fullName || "",
//       phone: addressAdd?.phone || "",
//     });
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <>
//         {addressAdd ? (
//           <CountrySelector
//             address={addressAdd?.address || null}
//             onBack={handleBackToList}
//             onAddressChange={handleAddressChange}
//             profile={null}
//           />
//         ) : (
//           <>
//             <h1 className="text-xl font-semibold text-gray-800 mb-4">
//               Danh sách địa chỉ
//             </h1>
//             <ul className="space-y-4">
//               {Array.isArray(addresses) && addresses.length > 0 ? (
//                 addresses.map((address) => (
//                   <li
//                     key={address?.addressID}
//                     className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//                   >
//                     <div className="text-base">
//                       <p className="font-bold text-gray-900 text-lg">
//                         {address?.fullName || "Không có tên"}
//                         {address?.isDefault && (
//                           <span className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
//                             Mặc định
//                           </span>
//                         )}
//                       </p>
//                       <p className="flex items-center text-gray-600 mt-1">
//                         <span className="font-medium text-gray-700 mr-2">
//                           Địa chỉ:
//                         </span>
//                         {address?.address || "Không có địa chỉ"}
//                       </p>
//                       <p className="flex items-center text-gray-600 mt-1">
//                         <span className="font-medium text-gray-700 mr-2">
//                           Số điện thoại:
//                         </span>
//                         {address?.phone || "Không có số điện thoại"}
//                       </p>
//                     </div>
//                     <div>
//                       <button
//                         onClick={() => {
//                           if (address._id) {
//                             handleSetDefaultAddress(address._id);
//                           } else {
//                             toast.error("Địa chỉ không hợp lệ.");
//                           }
//                         }}
//                         className="text-blue-500 hover:underline"
//                       >
//                         Đặt làm địa chỉ mặc định
//                       </button>

//                       <button className="text-blue-500 hover:underline">
//                         Chỉnh sửa
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (address._id) {
//                             handleDelete(address._id);
//                           } else {
//                             toast.error("Địa chỉ không hợp lệ.");
//                           }
//                         }}
//                         className="ml-4 text-red-500 hover:underline"
//                       >
//                         Xóa
//                       </button>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-gray-500">
//                   Không có địa chỉ nào để hiển thị.
//                 </li>
//               )}
//             </ul>

//             <div className="mt-6 flex justify-center w-full">
//               <button
//                 onClick={handleAddAddress}
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
//               >
//                 Thêm địa chỉ
//               </button>
//             </div>
//           </>
//         )}
//       </>

//       <ToastContainer />
//     </div>
//   );
// };

// export default ListAddress;
import { RootState, useAppDispatch } from "../../../../../redux/store";
import {
  fetchAddressListThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
} from "../../../../../redux/auth/authThunk";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Address } from "../../../../../types/user";
import CountrySelector from "./address";

const ListAddress: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addresses } = useSelector((state: RootState) => state.auth);
  const [addressAdd, setAddressAdd] = useState<Address | null>(null);
  // const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [, setEditAddress] = useState<Address | null>(null);

  useEffect(() => {
    dispatch(fetchAddressListThunk());
  }, [dispatch]);
  const handleDelete = (_id: string) => {
    if (_id) {
      Swal.fire({
        title: "Xác nhận xóa địa chỉ",
        text: "Bạn có chắc chắn muốn xóa địa chỉ này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result: SweetAlertResult) => {
        if (result.isConfirmed) {
          try {
            const response = await dispatch(deleteAddressThunk(_id)).unwrap();

            toast.dismiss();
            const successMessage =
              response?.message || "Xóa địa chỉ thành công!";
            toast.success(successMessage);
          } catch (error) {
            const errorMessage = (error as string) || "Không thể khóa.";
            toast.dismiss();
            toast.error(errorMessage);
          }
        }
      });
    } else {
      console.error("Address ID is undefined");
    }
  };

  const handleSetDefaultAddress = async (_id: string) => {
    // setIsLoading(true);
    try {
      const response = await dispatch(setDefaultAddressThunk(_id)).unwrap();
      await dispatch(fetchAddressListThunk());
      toast.dismiss();
      const successMessage =
        response?.message || "Đặt làm địa chỉ mặc định thành công!";
      toast.success(successMessage);
    } catch (error) {
      const errorMessage = (error as string) || "Không thể khóa.";
      toast.dismiss();
      toast.error(errorMessage);
    }
  };

  const handleBackToList = () => {
    setAddressAdd(null);
  };

  const handleAddAddress = () => {
    setAddressAdd({} as Address);
  };
  const handleAddressChange = (
    address: string,
    addressID: { provinceId: string; districtId: string; wardId: string }
  ) => {
    setAddressAdd({
      address: address,
      addressID: JSON.stringify(addressID),
      fullName: addressAdd?.fullName || "",
      phone: addressAdd?.phone || "",
    });
  };
  const handleAction = (action: string, address: Address) => {
    if (!address._id) {
      toast.error("Địa chỉ không hợp lệ.");
      return;
    }

    const isDefaultAddress = address.isDefault;

    switch (action) {
      case "setDefault":
        if (isDefaultAddress) {
          toast.error("Địa chỉ này đã là địa chỉ mặc định.");
          return;
        }
        handleSetDefaultAddress(address._id);
        break;
      case "edit":
        setEditAddress(address);
        break;
      case "delete":
        if (isDefaultAddress) {
          toast.error("Không thể xóa địa chỉ mặc định.");
          return;
        }
        handleDelete(address._id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 shadow-md rounded-lg transition-shadow duration-200">
      <>
        {addressAdd ? (
          <CountrySelector
            address={addressAdd?.address || null}
            onBack={handleBackToList}
            onAddressChange={handleAddressChange}
            profile={null}
          />
        ) : (
          <>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              Danh sách địa chỉ
            </h1>
            <ul className="space-y-4">
              {Array.isArray(addresses) && addresses.length > 0 ? (
                addresses.map((address) => (
                  <li
                    key={address?.addressID}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="text-base flex-1">
                      <p className="font-bold text-gray-900 text-lg">
                        {address?.fullName || "Không có tên"}
                        {address?.isDefault && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </p>
                      <p className="flex items-start sm:items-center text-gray-700 mt-2 sm:mt-1">
                        <span className="font-medium text-gray-800 mr-2">
                          Địa chỉ:
                        </span>

                        {address?.address || "Không có địa chỉ"}
                      </p>
                      <p className="flex items-start sm:items-center text-gray-700 mt-2 sm:mt-1">
                        <span className="font-medium text-gray-800 mr-2">
                          Số điện thoại:
                        </span>
                        {address?.phone || "Không có số điện thoại"}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            className="w-full sm:w-auto flex items-center justify-between px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 hover:border-gray-400 transition duration-200"
                          >
                            <span className="flex items-center">
                              <i className="iconify mdi--dots-vertical w-5 h-5 mr-2 text-gray-600" />
                              Hành động
                            </span>
                            <i className="iconify mdi--chevron-down w-4 h-4 text-gray-600" />
                          </Button>
                        </DropdownTrigger>

                        <DropdownMenu
                          variant="faded"
                          aria-label="Menu hành động địa chỉ"
                        >
                          <DropdownItem
                            key="setDefault"
                            onClick={() => handleAction("setDefault", address)}
                            startContent={
                              <i className="iconify mdi--check-circle-outline w-5 h-5 text-green-500 mr-2" />
                            }
                            isDisabled={address?.isDefault}
                          >
                            Đặt làm mặc định
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            onClick={() => handleAction("edit", address)}
                            startContent={
                              <i className="iconify mdi--edit w-5 h-5 text-blue-500 mr-2" />
                            }
                          >
                            Chỉnh sửa
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            onClick={() => handleAction("delete", address)}
                            startContent={
                              <i className="iconify mdi--delete w-5 h-5 text-red-500 mr-2" />
                            }
                            isDisabled={address?.isDefault}
                          >
                            Xóa
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center">
                  Không có địa chỉ nào để hiển thị.
                </li>
              )}
            </ul>

            <div className="mt-6 sm:mt-8 flex justify-center w-full">
              <Button
                onClick={() => {
                  if (addresses.length >= 10) {
                    toast.dismiss();
                    toast.error(
                      "Bạn không thể thêm quá 5 tài khoản ngân hàng."
                    );
                    return;
                  }
                  handleAddAddress();
                }}
                className={`w-full sm:w-auto px-6 py-3 ${
                  addresses.length >= 10
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-lg shadow focus:ring-4 focus:ring-blue-300 transition-all duration-200`}
                disabled={addresses.length >= 10}
              >
                Thêm địa chỉ
              </Button>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default ListAddress;
