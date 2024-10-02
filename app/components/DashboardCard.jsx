"use client";
import { useDashCardStore } from "@/app/store/DashCards";
import styles from "@/app/styles/dashboardCard.module.css";

import {

  CubeIcon as ProductIcon,
  UserGroupIcon as RefferalIcon,
  CreditCardIcon as RevenueIcon,
  BanknotesIcon as WalletIcon,
  ArrowTrendingUpIcon as IncreaseIcon,
  ArrowTrendingDownIcon as DecreaseIcon,
} from "@heroicons/react/24/outline";

export default function DashboardCard() {
  const { showCard, setShowCard } = useDashCardStore();

  const dashCardData = [
    {
      name: "Revenue",
      icon: RevenueIcon,
      title: "Total revenue",
      revenue: "Ksh 0",
      stats: "0% analyis done",
    },
    {
      name: "Wallet",
      icon: WalletIcon,
      title: "Wallet activities",
      revenue: "Ksh 0",
      stats: "0% analyis done",
    },
    {
      name: "Promotions",
      icon: ProductIcon,
      title: "Products promoted revenue",
      revenue: "Ksh 0",
      stats: "0% analyis done",
    },
    {
      name: "Referral",
      icon: RefferalIcon,
      title: "Referrals earning",
      revenue: "Ksh 0",
      stats: "0% analyis done",
    },

  
  ];

  return (
    <div className={styles.dashcardContainer}>
      {dashCardData.map((data, index) => (
        <div
          className={`${styles.dashcard} ${
            showCard === data.name ? styles.dashcardActive : ""
          }`}
          onClick={() => setShowCard(data.name)}
          key={index}
        >
          <div className={styles.dashcardTitle}>
            <h3> {data.title}</h3>
            <div className={styles.dashCardIconWrapper}>
            <data.icon height={24} width={24} />
            </div>
          </div>
          <h1>{data.revenue}</h1>
          {data.stats.includes("increase") ? (
            <div className={styles.statsContainer}>
              <IncreaseIcon height={20} width={20} />
              <p>{data.stats}</p>
            </div>
          ) : (
            <div className={styles.statsContainer}>
              <DecreaseIcon height={20} width={20} />
              <p>{data.stats}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
