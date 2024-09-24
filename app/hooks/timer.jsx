"use client";

import { useState, useEffect } from "react";

export const useTimer = (initialTime = 20 * 60 * 60) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    const savedTime = localStorage.getItem("biddingTimeLeft");
    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;
        localStorage.setItem("biddingTimeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, []);

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
