import React, { useState, useCallback } from "react";
import { useAppDispatch } from "../../../redux/store";
import { DeleteListProductThunk } from "../../../redux/product/admin/Thunk";

interface Props {
  onSearchChange?: (term: string) => void; 
}

const SearchFomDeletelistProduct: React.FC<Props> = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(DeleteListProductThunk({ page: 1, search: searchTerm }));
      onSearchChange?.(searchTerm);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  return (
    <div className="w-full md:w-1/2">
      <form className="flex items-center" onSubmit={handleSearch}>
        <label htmlFor="simple-search" className="sr-only">
          Tìm kiếm
        </label>
        <div className="relative w-full">
          <input
            id="simple-search"
            type="search"
            className="w-full py-1 px-2 border text-black border-gray-300 rounded-md shadow-sm"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center p-2 text-gray-700 bg-blue-500 border border-gray-300 rounded-r-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="#ffffff"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFomDeletelistProduct;
