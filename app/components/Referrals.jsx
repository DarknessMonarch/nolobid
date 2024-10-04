"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/Auth"; // Import useAuthStore to access phoneNumber
import { useReferralStore } from "@/app/store/Referral";
import styles from "@/app/styles/referrals.module.css";

// Simple Base64 encoding function for encryption (temporary solution)
const encryptPhoneNumber = (phoneNumber) => {
  return btoa(phoneNumber); // Base64 encryption (replace with more secure method if needed)
};

export default function Referral() {
  // Access phoneNumber from the auth store
  const { phoneNumber } = useAuthStore(); // Use phoneNumber instead of username
  const { referrals, referralLink, setReferralLink } = useReferralStore();

  useEffect(() => {
    if (phoneNumber) {
      generateReferralLink();
    }
  }, [phoneNumber]); // Run effect only when phoneNumber is available

  const generateReferralLink = () => {
    // Encrypt the phone number before generating the link
    const encryptedPhoneNumber = encryptPhoneNumber(phoneNumber);
    const link = `https://nolobid.vercel.app/authentication/signup?referral=${encryptedPhoneNumber}`;
    setReferralLink(link); // Update the referral link in the store
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
    </div>
  );
}
