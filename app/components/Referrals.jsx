"use client";
import Image from "next/image";
import { useAuthStore } from "@/app/store/Auth";
import { useReferralStore } from "@/app/store/Referral";
import styles from "@/app/styles/referrals.module.css";
import ProfileImage from "@/public/assets/auth1Image.jpg";
import { useEffect } from "react";

export default function Referral() {
  const { username, email, profile } = useAuthStore();
  const { referrals, referralLink, setReferralLink, generateMockReferralLink } = useReferralStore();

  useEffect(() => {
    useReferralStore.getState().setReferrals([
      { profile, title: username, email, amount: 100 },
      { profile, title: username, email, amount: 100 },
      { profile, title: username, email, amount: 100 },
    ]);
  }, []);

  const generateReferralLink = async () => {
    try {
      const response = await fetch('/api/referrals/mine/link', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to generate referral link');
      }
      const data = await response.json();
      setReferralLink(data.link);
    } catch (error) {
      console.error('Error generating referral link:', error);
      generateMockReferralLink();
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        console.log('Referral link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy referral link:', err);
      });
  };

  return (
    <div className={styles.referralContainer}>
      <h2>Referrals</h2>
      <p>You made {referrals.length} referrals this month</p>

      <div className={styles.generateLinkContainer}>
        <button onClick={generateReferralLink}>Generate Referral Link</button>
        {referralLink && (
          <>
            <input type="text" value={referralLink} readOnly />
            <button onClick={copyReferralLink}>Copy Link</button>
          </>
        )}
      </div>

      {referrals.map((data, index) => (
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
      ))}
    </div>
  );
}