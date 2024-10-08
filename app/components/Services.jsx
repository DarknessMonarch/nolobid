"use client";
import styles from "@/app/styles/services.module.css";

import {
  FireIcon as LiveBid,
  ClockIcon as BiddingIcon,
  ArchiveBoxIcon as DeliveryIcon,
  PhoneIcon as CustomerSupportIcon,
} from "@heroicons/react/24/outline";

const serviceData = [
  {
    title: "Live Bids",
    icon: <LiveBid className={styles.serviceIcon} height={30} alt="Live Bids" />,
    description:
      "Join live auctions and bid on exciting products in real-time.",
  },
  {
    title: "Instant Bidding",
    icon: (
      <BiddingIcon
        className={styles.serviceIcon}
        height={30}
        alt="Instant Bidding"
      />
    ),
    description: "Place your bids instantly without any delays or hassles.",
  },
  {
    title: "Fast Delivery",
    icon: (
      <DeliveryIcon
        className={styles.serviceIcon}
        height={30}
        alt="Fast Delivery"
      />
    ),
    description: "Get your winnings delivered to your doorstep in no time.",
  },
  {
    title: "24/7 Customer Support",
    icon: (
      <CustomerSupportIcon
        className={styles.serviceIcon}
        height={30}
        alt="24/7 Customer Support"
      />
    ),
    description:
      "We are here to assist you anytime with our round-the-clock support.",
  },
];

export default function Service() {
  return (
    <div className={styles.serviceContainer}>
      {serviceData.map((item, index) => (
        <div className={styles.service} key={index}>
          {item.icon}
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
