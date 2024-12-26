const NoAuctionWin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center text-gray-500">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2Fno-auction-win.svg?alt=media&token=c9f861c0-4cf8-4a02-9543-63082cb2ed01"
        alt="No products"
        className="w-32 h-32 mb-4"
      />
      <p className="text-gray-400">
       Chưa có đơn trúng đấu giá nào?
      </p>
    </div>
  );
};

export default NoAuctionWin;
