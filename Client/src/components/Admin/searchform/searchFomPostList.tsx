import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../../redux/store";
import { getListPostThunk } from "../../../redux/post/thunk";

const SearchPostList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getListPostThunk({ page: 1, search: searchTerm || undefined }));
  }, [searchTerm, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchPostList;
