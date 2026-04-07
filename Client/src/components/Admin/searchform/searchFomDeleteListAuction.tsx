import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../../redux/store"; 
import { getDeleteListAuctionThunk } from "../../../redux/product/admin/Thunk";

const SearchFomDeleteListAuction: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getDeleteListAuctionThunk({ page: 1, search: searchTerm || undefined }));
  }, [searchTerm, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

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
        </div>
      </form>
    </div>
  );
};

export default SearchFomDeleteListAuction;
