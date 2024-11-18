import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBanks,
  addBankThunk,
  listBankThunk,
} from "../../../../../redux/auth/bank/bankThunk";
// import { getBank } from "../../../../../services/authentication/bank";
import { RootState, AppDispatch } from "../../../../../redux/store";
import { Bank } from "../../../../../types/user";
import { toast } from "react-toastify";
import { Select, SelectItem, Avatar, Button } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
interface BankSelectorProps {
  // address: string | null;
  onBack: () => void;
  // onAddressChange: (
  //   address: string,
  //   addressID: { provinceId: string; districtId: string; wardId: string }
  // ) => void;
  // profile: Address | null;
}

const BankSelectComponent: React.FC<BankSelectorProps> = ({ onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data } = useSelector((state: RootState) => state.Bank);

  const [newBank, setNewBank] = useState<Bank>({
    name: "",
    fullName: "",
    accountNumber: "",
    code: "",
    bin: "",
    shortName: "",
    logo: "",
    transferSupported: 1,
    lookupSupported: 1,
    support: 0,
    isTransfer: false,
    swift_code: "",
  });

  const [selectedBank, setSelectedBank] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bankId = Number(e.target.value);
    setSelectedBank(bankId);

    const selectedBankData = data.find((bank) => bank.id === bankId);
    if (selectedBankData) {
      setNewBank({
        ...newBank,
        name: selectedBankData.name,
        code: selectedBankData.code,
        bin: selectedBankData.bin,
        shortName: selectedBankData.shortName,
        logo: selectedBankData.logo,
        transferSupported: selectedBankData.transferSupported,
        lookupSupported: selectedBankData.lookupSupported,
        support: selectedBankData.support,
        isTransfer: selectedBankData.isTransfer,
        swift_code: selectedBankData.swift_code,
      });
    }
  };

  const handleAddBank = async () => {
    try {
      const response = await dispatch(addBankThunk(newBank)).unwrap();
      await dispatch(listBankThunk());
      toast.dismiss();
      const successMessage = response?.message || "Ngân hàng đã được thêm";
      toast.success(successMessage);
      setTimeout(() => {
        onBack();
      }, 1000);
      dispatch(getBanks());
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      const errorMessage =
        (error as Error).message || "Registration failed. Please try again.";
      toast.dismiss();
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Chọn Ngân Hàng
      </h2>
      <Select
        className="w-full mb-6"
        label="Chọn ngân hàng"
        value={selectedBank || ""}
        onChange={(e) =>
          handleBankSelect(e as React.ChangeEvent<HTMLSelectElement>)
        }
      >
        {data
          .filter((bank) => bank && bank.id)
          .map((bank) => (
            <SelectItem
              key={bank.id || "null"}
              value={bank.id}
              startContent={
                <Avatar alt={bank.name} className="w-12 h-12" src={bank.logo} />
              }
            >
              {bank.name}
            </SelectItem>
          ))}
      </Select>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddBank();
        }}
        className="space-y-6"
      >
        <input
          type="text"
          value={newBank.accountNumber}
          onChange={(e) =>
            setNewBank({ ...newBank, accountNumber: e.target.value })
          }
          placeholder="Số tài khoản"
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
        <input
          type="text"
          value={newBank.fullName}
          onChange={(e) => setNewBank({ ...newBank, fullName: e.target.value })}
          placeholder="Họ tên đầy đủ"
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />

        <Button
          type="submit"
          disabled={loading}
          className={`w-full  py-4 text-white font-semibold rounded-md shadow-md focus:outline-none transition-all duration-300 
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang thêm..." : "Thêm Ngân Hàng"}
        </Button>
      </form>
      <button className="mt-6" color="gray" onClick={onBack}>
        Quay lại danh sách địa chỉ
      </button>
    </div>
  );
};

export default BankSelectComponent;
