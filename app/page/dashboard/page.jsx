"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Revenue from "@/app/components/Revenue";
import { useAuthStore } from "@/app/store/Auth";
import Referrals from "@/app/components/Referrals";
import Promotions from "@/app/components/Promotions";
import styles from "@/app/styles/dashboard.module.css";
import { useDashCardStore } from "@/app/store/DashCards";
import DashboardCard from "@/app/components/DashboardCard";
import StatisticGraph from "@/app/components/StatisticsGraph";
import WalletActivities from "@/app/components/WalletActivities";

export default function DashboardPage() {
  const { isAuth, username } = useAuthStore();
  const { showCard } = useDashCardStore();

  useEffect(() => {
    if (!isAuth) {
      redirect("/page/home");
    }
  }, [isAuth]);

  const renderCardContent = () => {
    switch (showCard) {
      case "Referral":
        return <Referrals />;
      case "Promotions":
        return <Promotions />;
      case "Wallet":
        return <WalletActivities />;
      case "Revenue":
        return <Revenue />;
      default:
        return <Revenue />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardTitle}>
        <h1>Welcome</h1>
        <span>{username}</span>
      </div>
      <DashboardCard />
      <div className={styles.dashboardLayout}>
        <div className={styles.sideContent}>
          <StatisticGraph />
        </div>
        <div className={styles.sideContent}>
          {renderCardContent()}
        </div>
      </div>
    </div>
  );
}
