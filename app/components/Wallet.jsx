"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/app/components/loader";
import styles from "@/app/styles/wallet.module.css";
import WalletImage from "@/public/assets/walletCard.png";
import {
  BanknotesIcon as AmountIcon,
  PhoneIcon as PhoneIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Wallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(200);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const closeCard = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("wallet");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      // const response = await fetch("/api/submit", {
      //   method: "POST",
      //   body: formData,
      // });

      toast.success("Paid successfully");
    } catch (error) {
      toast.error("failed to make payment");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={styles.walletContainer}>
      <div className={styles.cardImageTop}>
        <CloseIcon
          className={styles.closeIcon}
          onClick={closeCard}
          alt="close icon"
          width={24}
          height={24}
        />
      </div>
      <div className={styles.cardWalletImage}>
         <Image
              className={styles.walletImage}
              src={WalletImage}
               alt="wallet image"
              height={250}
              priority={true}
            />
        <div className={styles.cardWalletInfo}>
          <h1>Wallet Amount</h1>
          <h2>Ksh. {amount}</h2>
        </div>
      </div>
      <form onSubmit={onSubmit} className={styles.footerForm}>
        {/* Phone Number */}
        <div className={styles.formInputContain}>
          <div className={styles.formInputWrapper}>
            <label htmlFor="Phone Number">Phone Number</label>
            <div className={styles.formInput}>
              <PhoneIcon
                className={styles.formIcon}
                alt="Phone icon"
                width={30}
                height={30}
              />
              <input
                type="text"
                name="Phone"
                id="Phone"
                required
                placeholder="07XXXXXXXX"
              />
            </div>
          </div>

          {/* Amount */}
          <div className={styles.formInputWrapper}>
            <label htmlFor="Amount">Amount</label>
            <div className={styles.formInput}>
              <AmountIcon
                className={styles.formIcon}
                alt="Amount icon"
                width={30}
                height={30}
              />
              <input
                type="text"
                name="Amount"
                required
                id="Amount"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.formButton}
        >
          {isLoading ? <Loader /> : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
