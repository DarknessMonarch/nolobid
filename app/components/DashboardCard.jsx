"use client";
import styles from "@/app/styles/dashboardCard.module.css";

import {
    UserIcon as UserNameIcon,
    EnvelopeIcon as EmailIcon,
    PhoneIcon,
  } from "@heroicons/react/24/outline";

const InfocardData = [
  {
    icon: "",
    title: "1. Enter Bid",
    moneyMade:"",
    description:
      "Visit  our Website,select the item you wish to bid on and enter your bid amount!",
  },
  {
    title: "2. Wallet Deposit",

    description: "Pay directly through mpesa or deposit to your wallet to pay",
  },
  {
    title: "3. Wait for a win",

    description:
      "After the bidding is closed, you will be announced as the winner if your bid was the Lowest Unique Bid",
  },
];

export default function DashboardCard() {
  return (
    <div className={styles.infocardContainer}>
      {InfocardData.map((item, index) => (
        <div className={styles.infocard} key={index}>
          <h2> {item.title}</h2>
          <p>{item.description}</p>
          {/* <ClockIcon height={20} width={20} className={styles.sideNavIcon} /> */}
        </div>
      ))}
    </div>
  );
}
