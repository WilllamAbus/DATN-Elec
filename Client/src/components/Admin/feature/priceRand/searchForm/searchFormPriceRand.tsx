import React, { useState } from "react";

const SearchFormProduct: React.FC<{ onSearch: (searchTerm: string) => void }> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);  // Gửi giá trị search về component cha
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
            className="w-full py-1 px-2 border border-gray-300 rounded-l-md shadow-sm h-10" // Giảm chiều cao của input
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center justify-center 
            p-2 text-white bg-blue-500 border border-gray-300 rounded-r-sm h-10" // Thay đổi màu kính lúp và giảm chiều cao
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
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
