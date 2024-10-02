"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/Auth";
import { useReferralStore } from "@/app/store/Referral";
import styles from "@/app/styles/referrals.module.css";

export default function Referral() {
  const { username } = useAuthStore();
  const { referrals, referralLink, setReferralLink } = useReferralStore();

  useEffect(() => {
    generateReferralLink();
  }, []);
  const generateReferralLink = () => {
    const link = `https://nolobid.vercel.app/authentication/signup?referral=${username}`;
    setReferralLink(link);
  };

  const copyReferralLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        toast.success("Referral link copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy referral link");
      });
  };

  return (
    <div className={styles.referralContainer}>
      <h2>Referrals</h2>
      <p>You made {referrals.length} referrals this month</p>

      <div className={styles.generateLinkContainer}>
        <div className={styles.referralLinkInput}>{referralLink}</div>
        <button onClick={copyReferralLink} className={styles.copyButton}>Copy Link</button>
      </div>

      {/* Uncomment the below code to display referrals */}
      {/* {referrals.map((data, index) => (
        <div key={index} className={styles.referralItem}>
          <div className={styles.referralInfo}>
            <Image src={data.profile || ProfileImage} alt="Profile" width={50} height={50} />
            <div>
              <h3>{data.title}</h3>
              <p>{data.email}</p>
            </div>
          </div>
          <div className={styles.referralAmount}>
            +{data.amount}
          </div>
        </div>
      ))} */}
    </div>
  );
}
