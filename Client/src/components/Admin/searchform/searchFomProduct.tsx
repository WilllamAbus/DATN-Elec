import React, { useState } from "react";
import { useAppDispatch } from "../../../redux/store"; 
import { fetchPaginatedProducts } from "../../../redux/product/admin/Thunk";

const SearchFormProduct: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchPaginatedProducts({ page: 1, search: searchTerm }));
  };

  return (
    <div className="w-full md:w-1/2">
      <form className="flex items-center" onSubmit={handleSearch}>
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <input
            id="simple-search"
            type="search"
            className="w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center p-2 text-gray-700 bg-blue-500 border border-gray-300 rounded-r-md"
          >
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
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFormProduct;
