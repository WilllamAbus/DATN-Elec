const NoProductsMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center text-gray-500">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/no-product%2Ffeatures.png?alt=media&token=90772e1b-6efd-4701-b33f-c7233ad5d01b"
        alt="No products"
        className="w-32 h-32 mb-4"
      />
      <p className="text-gray-400">
       Chưa có sản phẩm?
      </p>
    </div>
  );
};

export default NoProductsMessage;
