const SearchMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center text-gray-500">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/no-product%2Fno-product.png?alt=media&token=1ed14df4-2023-4e13-b25e-ba4296975c6c"
        alt="No products"
        className="w-32 h-32 mb-4"
      />
      <p className="text-gray-400">
        Hix. Không có sản phẩm nào. Vui lòng xóa từ khóa?
      </p>
    </div>
  );
};

export default SearchMessage;
