import { useState, useEffect } from "react";

export const useTimer = (expiryDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const targetTime = new Date(expiryDate).getTime();
      const difference = targetTime - currentTime;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();

    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  const formatTime = ({ days, hours, minutes, seconds }) => {
    return `${days} D : ${hours.toString().padStart(2, "0")} H : ${minutes.toString().padStart(2, "0")} M : ${seconds.toString().padStart(2, "0")} S`;
  };

  return { timeLeft, isClient, formatTime };
};