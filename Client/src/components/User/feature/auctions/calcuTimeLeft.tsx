export const calculateTimeLeft = (endDate: Date): string => {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();
  
    if (difference <= 0) {
      return "Hết thời gian";
    }
  
    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
  
    const days = totalDays;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
  
    return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  };
  