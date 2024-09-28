"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "@/app/components/loader";
import { useAuthStore } from "@/app/store/Auth";
import Refferal from "@/app/components/Refferal";
import styles from "@/app/styles/dashboard.module.css";
import DashboardCard from "@/app/components/DashboardCard";
import StatisticGraph from "@/app/components/StatisticsGraph";

import {
  PhoneIcon,
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  CalendarIcon as DateIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
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
      // Handle the response data as needed
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Welcome {username}</h1>
        <div className={styles.dateFilter}>
          <DateIcon height={20} width={20} className={styles.sideNavIcon} />
          <input type="date" name="date" className={styles.dateFilter} />
        </div>
        </div>
        <div className={styles.dashboardContent}>
          <DashboardCard />
          <div className={styles.dashboardLayout}>
            <div className={styles.sideContent}>
              <StatisticGraph />
            </div>
          </div>
          <div className={styles.sideContent}>
            <Refferal />
            <div className={styles.refferalLinkContainer}></div>
          </div>
        </div>
    
    </div>
  );
}
