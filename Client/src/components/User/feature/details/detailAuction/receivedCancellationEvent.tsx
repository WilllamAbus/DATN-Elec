import { useEffect } from "react";
import socket from "../../../../../services/rtsk/sk";

interface ReceivedCancellationEventProps {
  onCancellation: (status: string) => void;
}

const ReceivedCancellationEvent: React.FC<ReceivedCancellationEventProps> = ({ onCancellation }) => {
  useEffect(() => {
    const handleCancellation = (data: { status: string }) => {
      if (data.status === "cancelled") {
        console.log("Auction has been cancelled.");
        onCancellation("active");
      }
    };

    socket.on("auctionCancelled", handleCancellation);

    return () => {
      socket.off("auctionCancelled", handleCancellation);
    };
  }, [onCancellation]);

  return null;
};

export default ReceivedCancellationEvent;
