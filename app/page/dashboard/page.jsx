"use client";

import { redirect } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import Referrals from "@/app/components/Referrals";
import { useState, useEffect, useRef } from "react";
import styles from "@/app/styles/dashboard.module.css";
import { useDashCardStore } from "@/app/store/DashCards";
import DashboardCard from "@/app/components/DashboardCard";
import StatisticGraph from "@/app/components/StatisticsGraph";

export default function DashboardPage() {
  const { showCard, setShowCard } = useDashCardStore();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, username } = useAuthStore();

  useEffect(() => {
    if (!isAuth) {
      redirect("/page/home");
    }
  }, [isAuth]);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardTitle}>
        <h1>Welcome </h1> <span>{username}</span>
      </div>
        <DashboardCard />
        <div className={styles.dashboardLayout}>
          <div className={styles.sideContent}>
            <StatisticGraph />
          </div>
          <div className={styles.sideContent}>
            <Referrals />
        </div>
      </div>
    </div>
  );
}
