"use client";
import Image from "next/image";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/referrals.module.css";
import ProfileImage from "@/public/assets/auth1Image.jpg";

export default function Referral() {
  const { username, email, profile } = useAuthStore();
  const ReferralData = [
    {
      profile: profile,
      title: username,
      email: email,
      amount: 100,
    },
    {
      profile: profile,
      title: username,
      email: email,
      amount: 100,
    },
    {
      profile: profile,
      title: username,
      email: email,
      amount: 100,
    },
  ];

  return (
    <div className={styles.referralContainer}>
      <div className={styles.referralHeader}>
        <h1>Referrals</h1>
        <p>You made {ReferralData.length} referrals this months</p>
      </div>
      {ReferralData.map((data, index) => (
        <div className={styles.referralContainerWrapper} key={index}>
          <Image
            className={styles.referralImage}
            src={data.profile !== null ? data.profile : ProfileImage}
            alt={data.title}
            height={120}
            width={120}
            priority={true}
          />
          <div className={styles.referralImageInfo}>
            <div className={styles.referralImageInfoWrapper}>
              <h2>{data.title}</h2>
              <span>{data.email}</span>
            </div>
            <p>+{data.amount}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
