"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Loader from "@/app/components/loader";
import styles from "@/app/styles/wallet.module.css";
import WalletImage from "@/public/assets/walletCard.png";
import {
  PhoneIcon as PhoneIcon,
  XMarkIcon as CloseIcon,
  BanknotesIcon as AmountIcon,
  EyeIcon as ShowAmountIcon,
  EyeSlashIcon as HideAmountIcon,
  ArrowsUpDownIcon as DepositIcon,
  ArrowDownTrayIcon as WithrawIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Wallet() {
  const [btnController, setbtnController] = useState("Deposit");
  const [showAmount, setShowAmount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(200);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAmountShown = localStorage.getItem("showAmount");
    if (isAmountShown !== null) {
      setShowAmount(isAmountShown);
    }
  }, []);

  const toggleShowAmount = () => {
    setShowAmount(!showAmount);
    localStorage.setItem("showAmount", showAmount);
  };

  const updateController = (state) => {
    setbtnController(state);
  };
  const closeCard = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("wallet");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const api = btnController === "Deposit" ? "/api/deposit" : "/api/withdraw";

    try {
      const formData = new FormData(e.currentTarget);
      // const response = await fetch(`${api}`, {
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
        <div className={styles.hideBtnWrapper}>
          {showAmount ? (
            <ShowAmountIcon
              className={styles.hideIcon}
              onClick={toggleShowAmount}
              alt="show icon"
              width={24}
              height={24}
            />
          ) : (
            <HideAmountIcon
              className={styles.hideIcon}
              onClick={toggleShowAmount}
              alt="hide icon"
              width={24}
              height={24}
            />
          )}
        </div>
        <Image
          className={styles.walletImage}
          src={WalletImage}
          alt="wallet image"
          height={250}
          priority={true}
        />
        <div className={styles.cardWalletInfo}>
          <h1>Wallet Amount</h1>
          {showAmount ? (
            <h2>Ksh. {amount}</h2>
          ) : (
            <div className={styles.hiddenAmount}></div>
          )}
        </div>
      </div>
      <div className={styles.walletController}>
        <div
          className={`${styles.walletControllerBtn} ${
            btnController === "Deposit" ? `${styles.activeWalletBtn}` : ""
          }`}
          onClick={() => updateController("Deposit")}
        >
          <DepositIcon
            className={styles.walletIconB}
            alt="deposit icon"
            width={24}
            height={24}
          />
          <h5>Deposit</h5>
        </div>
        <div
          className={`${styles.walletControllerBtn} ${
            btnController === "Withdraw" ? `${styles.activeWalletBtn}` : ""
          }`}
          onClick={() => updateController("Withdraw")}
        >
          <WithrawIcon
            className={styles.walletIconB}
            alt="withdraw icon"
            width={24}
            height={24}
          />
          <h5>Withdraw</h5>
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
          {isLoading ? <Loader /> : btnController}
        </button>
      </form>
    </div>
  );
}
