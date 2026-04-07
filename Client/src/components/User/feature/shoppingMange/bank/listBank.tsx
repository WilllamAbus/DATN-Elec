// import { RootState, useAppDispatch } from "../../../../../redux/store";
// // import {
// //   fetchAddressListThunk,
// //   deleteAddressThunk,
// //   setDefaultAddressThunk,
// // } from "../../../../../redux/auth/authThunk";
// import {
//   deleteBankThunk,
//   listBankThunk,
// } from "../../../../../redux/auth/bank/bankThunk";
// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   Button,
// } from "@nextui-org/react";
// import Swal, { SweetAlertResult } from "sweetalert2";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Bank } from "../../../../../types/user";
// import CountrySelector from "./addBank";

// const ListAddress: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { banks } = useSelector((state: RootState) => state.Bank);
//   const [Bankadd, setBankadd] = useState<Bank | null>(null);
//   // const [editAddress, setEditAddress] = useState<Address | null>(null);
//   const [, setEditAddress] = useState<Bank | null>(null);

//   const handleBackToList = () => {
//     setAddressAdd(null);
//   };

//   const handleAddBank = () => {
//     setBankAdd({} as Bank);
//   };
//   useEffect(() => {
//     dispatch(listBankThunk());
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
//             const response = await dispatch(deleteBankThunk(_id)).unwrap();

//             toast.dismiss();
//             const successMessage =
//               response?.message || "Xóa ngân hàng thành công!";
//             toast.success(successMessage);
//           } catch (error) {
//             const errorMessage = (error as string) || "Không thể xóa.";
//             toast.dismiss();
//             toast.error(errorMessage);
//           }
//         }
//       });
//     } else {
//       console.error("Address ID is undefined");
//     }
//   };

//   //   const handleSetDefaultAddress = async (_id: string) => {
//   //     // setIsLoading(true);
//   //     try {
//   //       const response = await dispatch(setDefaultAddressThunk(_id)).unwrap();
//   //       await dispatch(listBankThunk());
//   //       toast.dismiss();
//   //       const successMessage =
//   //         response?.message || "Đặt làm địa chỉ mặc định thành công!";
//   //       toast.success(successMessage);
//   //     } catch (error) {
//   //       const errorMessage = (error as string) || "Không thể khóa.";
//   //       toast.dismiss();
//   //       toast.error(errorMessage);
//   //     }
//   //   };

//   const handleAction = (action: string, Bank: Bank) => {
//     if (!Bank._id) {
//       toast.error("Địa chỉ không hợp lệ.");
//       return;
//     }

//     const isDefaultAddress = Bank.isDefault;

//     switch (action) {
//       //   case "setDefault":
//       //     if (isDefaultAddress) {
//       //       toast.error("Địa chỉ này đã là địa chỉ mặc định.");
//       //       return;
//       //     }
//       //     handleSetDefaultAddress(address._id);
//       //     break;
//       //   case "edit":
//       //     setEditAddress(address);
//       //  break;
//       case "delete":
//         if (isDefaultAddress) {
//           toast.error("Không thể xóa địa chỉ mặc định.");
//           return;
//         }
//         handleDelete(Bank._id);
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 shadow-md rounded-lg transition-shadow duration-200">
//       <>
//         {Bankadd ? (
//           <CountrySelector />
//         ) : (
//           <>
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">
//               Danh sách ngân hàng
//             </h1>
//             <ul className="space-y-4">
//               {Array.isArray(banks) && banks.length > 0 ? (
//                 banks.map((banks) => (
//                   <li
//                     key={banks?._id}
//                     className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
//                   >
//                     <div className="text-base">
//                       <p className="font-bold text-gray-900 text-lg">
//                         {banks?.name || "Không có tên"}
//                         {banks?.isDefault && (
//                           <span className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
//                             Mặc định
//                           </span>
//                         )}
//                       </p>
//                       <p className="flex items-center text-gray-700 mt-1">
//                         <span className="font-medium text-gray-800 mr-2">
//                           Họ tên
//                         </span>
//                         {banks?.fullName || "Không có tên"}
//                       </p>
//                       <p className="flex items-center text-gray-700 mt-1">
//                         <span className="font-medium text-gray-800 mr-2">
//                           Số tài khoản
//                         </span>
//                         {banks?.accountNumber || "Không có số tk"}
//                       </p>
//                     </div>

//                     <Dropdown>
//                       <DropdownTrigger>
//                         <Button
//                           variant="bordered"
//                           className="flex items-center justify-between px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 hover:border-gray-400 transition duration-200"
//                         >
//                           <span className="flex items-center">
//                             <i className="iconify mdi--dots-vertical w-5 h-5 mr-2 text-gray-600" />
//                             Hành động
//                           </span>
//                           <i className="iconify mdi--chevron-down w-4 h-4 text-gray-600" />
//                         </Button>
//                       </DropdownTrigger>

//                       <DropdownMenu
//                         variant="faded"
//                         aria-label="Menu hành động địa chỉ"
//                       >
//                         <DropdownItem
//                           key="setDefault"
//                           //   onClick={() => handleAction("setDefault", address)}
//                           startContent={
//                             <i className="iconify mdi--check-circle-outline w-5 h-5 text-green-500 mr-2" />
//                           }
//                           isDisabled={banks?.isDefault}
//                         >
//                           Đặt làm mặc định
//                         </DropdownItem>
//                         <DropdownItem
//                           key="edit"
//                           //   onClick={() => handleAction("edit", address)}
//                           startContent={
//                             <i className="iconify mdi--edit w-5 h-5 text-blue-500 mr-2" />
//                           }
//                         >
//                           Chỉnh sửa
//                         </DropdownItem>
//                         <DropdownItem
//                           key="delete"
//                           color="danger"
//                           //   onClick={() => handleAction("delete", address)}
//                           startContent={
//                             <i className="iconify mdi--delete w-5 h-5 text-red-500 mr-2" />
//                           }
//                           isDisabled={banks?.isDefault}
//                         >
//                           Xóa
//                         </DropdownItem>
//                       </DropdownMenu>
//                     </Dropdown>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-gray-500">
//                   Không có địa chỉ nào để hiển thị.
//                 </li>
//               )}
//             </ul>

//             <div className="mt-8 flex justify-center w-full">
//               <Button
//                 // onClick={handleAddAddress}
//                 className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
//               >
//                 Thêm Ngân hàng
//               </Button>
//             </div>
//           </>
//         )}
//       </>

//       <ToastContainer />
//     </div>
//   );
// };

// export default ListAddress;
import {
  deleteBankThunk,
  listBankThunk,
  setDefaultBankThunk,
} from "../../../../../redux/auth/bank/bankThunk";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bank } from "../../../../../types/user";
import BankSelectComponent from "./addBank";
import { RootState, useAppDispatch } from "../../../../../redux/store";

const ListBank: React.FC = () => {
  const dispatch = useAppDispatch();
  const { banks } = useSelector((state: RootState) => state.Bank);
  const [bankAdd, setBankAdd] = useState<Bank | null>(null);
  const [editBank, setEditBank] = useState<Bank | null>(null);

  const handleBackToList = () => {
    setBankAdd(null);
    setEditBank(null);
  };

  const handleAddBank = () => {
    setBankAdd({} as Bank);
  };

  useEffect(() => {
    dispatch(listBankThunk());
  }, [dispatch]);

  const handleDelete = (_id: string) => {
    Swal.fire({
      title: "Xác nhận xóa ngân hàng",
      text: "Bạn có chắc chắn muốn xóa ngân hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteBankThunk(_id)).unwrap();
          toast.dismiss();
          toast.success(response?.message || "Xóa ngân hàng thành công!");
        } catch (error) {
          toast.dismiss();
          toast.error("Không thể xóa ngân hàng.");
        }
      }
    });
  };
  const handleSetDefaultBank = async (_id: string) => {
    // setIsLoading(true);
    try {
      const response = await dispatch(setDefaultBankThunk(_id)).unwrap();
      await dispatch(listBankThunk());
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
  const handleAction = (action: string, bank: Bank) => {
    if (!bank._id) {
      toast.error("Ngân hàng không hợp lệ.");
      return;
    }

    const isDefaultBank = bank.isDefault;

    switch (action) {
      // case "edit":
      //   setEditBank(bank);
      //   break;
      case "delete":
        if (isDefaultBank) {
          toast.error("Không thể xóa ngân hàng mặc định.");
          return;
        }
        handleDelete(bank._id);
        break;
      case "setDefault":
        if (isDefaultBank) {
          toast.error("Địa chỉ này đã là địa chỉ mặc định.");
          return;
        }
        handleSetDefaultBank(bank._id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg transition-shadow duration-200">
      <>
        {bankAdd || editBank ? (
          <BankSelectComponent onBack={handleBackToList} />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Danh sách ngân hàng
            </h1>
            <ul className="space-y-4">
              {Array.isArray(banks) && banks.length > 0 ? (
                banks.map((bank) => (
                  <li
                    key={bank?._id}
                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="text-base">
                      <p className="font-bold text-gray-900 text-lg">
                        {bank?.name || "Không có tên ngân hàng"}
                        {bank?.isDefault && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </p>
                      <p className="flex items-center text-gray-700 mt-1">
                        <span className="font-medium text-gray-800 mr-2">
                          Họ tên:
                        </span>
                        {bank?.fullName || "Không có tên"}
                      </p>
                      <p className="flex items-center text-gray-700 mt-1">
                        <span className="font-medium text-gray-800 mr-2">
                          Số tài khoản:
                        </span>
                        {bank?.accountNumber || "Không có số tài khoản"}
                      </p>
                    </div>

                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="flex items-center justify-between px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 hover:border-gray-400 transition duration-200"
                        >
                          Hành động
                        </Button>
                      </DropdownTrigger>

                      <DropdownMenu variant="faded" aria-label="Menu hành động">
                        {/* <DropdownItem
                          key="edit"
                          onClick={() => handleAction("edit", bank)}
                          startContent={
                            <i className="iconify mdi--edit w-5 h-5 text-blue-500 mr-2" />
                          }
                        >
                          Chỉnh sửa
                        </DropdownItem> */}
                        <DropdownItem
                          key="delete"
                          color="danger"
                          onClick={() => handleAction("delete", bank)}
                          startContent={
                            <i className="iconify mdi--delete w-5 h-5 text-red-500 mr-2" />
                          }
                          isDisabled={bank?.isDefault}
                        >
                          Xóa
                        </DropdownItem>
                        <DropdownItem
                          key="setDefault"
                          onClick={() => handleAction("setDefault", bank)}
                          startContent={
                            <i className="iconify mdi--check-circle-outline w-5 h-5 text-green-500 mr-2" />
                          }
                          isDisabled={bank?.isDefault}
                        >
                          Đặt làm mặc định
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Không có ngân hàng nào.</li>
              )}
            </ul>

            {/* <div className="mt-8 flex justify-center w-full">
              <Button
                onClick={handleAddBank}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
              >
                Thêm Ngân hàng
              </Button>
            </div> */}
            <div className="mt-8 flex justify-center w-full">
              <Button
                onClick={() => {
                  if (banks.length >= 5) {
                    toast.error(
                      "Bạn không thể thêm quá 5 tài khoản ngân hàng."
                    );
                    return;
                  }
                  handleAddBank();
                }}
                className={`px-6 py-3 ${
                  banks.length >= 5
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-lg shadow focus:ring-4 focus:ring-blue-300 transition-all duration-200`}
                disabled={banks.length >= 5}
              >
                Thêm Ngân hàng
              </Button>
            </div>
          </>
        )}
      </>

      <ToastContainer />
    </div>
  );
};

export default ListBank;
