  import { useEffect } from "react";
  import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
  import { AppDispatch } from "../../../../../redux/store";
  import { clearAuctionWinById, getUserPendingAuctionWinsThunk } from "../../../../../redux/sessionAuction/thunk";
  import { toast } from "react-hot-toast";

  export const useRemainingTimes = (
    auctions: AuctionWin[],
    setRemainingTimes: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    dispatch: AppDispatch,
    setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>,
    notificationFlag: React.MutableRefObject<boolean>
  ) => {
    useEffect(() => {
      const interval = setInterval(async () => {
        const newRemainingTimes = auctions.reduce<{ [key: string]: string }>((acc, auction) => {
          const endTime = new Date(auction.endTime).getTime();
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;

        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        acc[auction._id] = remainingTime > 0
          ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
          : "Đã kết thúc";

        return acc;
      }, {});

        setRemainingTimes(newRemainingTimes);

        const expiredAuctions = auctions.filter((auction) => newRemainingTimes[auction._id] === "Đã kết thúc");
        if (expiredAuctions.length > 0 && !notificationFlag.current) {
          notificationFlag.current = true;

          try {
            const response = await dispatch(getUserPendingAuctionWinsThunk()).unwrap();

            if (response.code === 'THANH_CONG') {
              toast.success(response.msg || "Cập nhật trạng thái thành công!");

              setTimeout(() => {
                setAlertVisible(true);
                setTimeout(() => {
                  expiredAuctions.forEach((auction) => dispatch(clearAuctionWinById(auction._id)));
                  notificationFlag.current = false;
                  setAlertVisible(false);
                }, 5000);
              }, 3000);
            } else {
              toast.success(response.msg || "Không có thay đổi trạng thái!");
              notificationFlag.current = false;
            }
          } catch (error: any) {
            toast.error(error.msg || "Cập nhật trạng thái thất bại!");
            notificationFlag.current = false;
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [auctions, dispatch]);
  };
