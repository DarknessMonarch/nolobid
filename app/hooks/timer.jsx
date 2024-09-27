import { useState, useEffect } from "react";

export const useTimer = (expiryDate) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const targetTime = new Date(expiryDate).getTime();
      const difference = targetTime - currentTime;

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000)); 
      } else {
        setTimeLeft(0); 
      }
    };

    calculateTimeLeft();

    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000); 

    return () => clearInterval(timer);
  }, [expiryDate]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} H : ${minutes.toString().padStart(2, "0")} M : ${seconds
      .toString()
      .padStart(2, "0")} S`;
  };

  return { timeLeft, isClient, formatTime };
};
