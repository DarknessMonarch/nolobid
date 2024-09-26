"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/app/components/loader";
import { useAuthStore } from "@/app/store/Auth";
import { useWalletStore } from "@/app/store/Wallet";
import styles from "@/app/styles/wallet.module.css";
import WalletImage from "@/public/assets/walletCard.png";
import { useState, useEffect, useCallback } from "react";

import {
  PhoneIcon,
  XMarkIcon as CloseIcon,
  BanknotesIcon as AmountIcon,
  EyeIcon as ShowAmountIcon,
  EyeSlashIcon as HideAmountIcon,
  ArrowsUpDownIcon as DepositIcon,
  ArrowDownTrayIcon as WithdrawIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Wallet() {
  const [transactionType, setTransactionType] = useState("Deposit");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth } = useAuthStore();
  const { amount, showAmount, toggleShowAmount, deposit, withdraw } = useWalletStore();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const closeCard = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("wallet");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handlePhoneNumberChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value.slice(0, 10));
  }, []);

  const handleAmountChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "");
    setTransactionAmount(value);
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isAuth) {
        toast.error("Please log in to perform transactions");
        return;
      }

      setIsLoading(true);
      try {
        const amountValue = parseInt(transactionAmount);
        if (transactionType === "Deposit") {
          deposit(amountValue);
          toast.success(`Deposited Ksh. ${amountValue.toLocaleString()}`);
        } else if (transactionType === "Withdraw") {
          if (amountValue > amount) {
            throw new Error("Insufficient balance");
          }
          withdraw(amountValue);
          toast.success(`Withdrew Ksh. ${amountValue.toLocaleString()}`);
        }

        setTransactionAmount("");
        setPhoneNumber(""); // Reset phone number after transaction
      } catch (error) {
        toast.error(`Failed to ${transactionType.toLowerCase()}: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [transactionType, transactionAmount, isAuth, deposit, withdraw, amount]
  );

  return (
    <div className={styles.walletContainer}>
      <div className={styles.cardImageTop}>
        <CloseIcon
          className={styles.closeIcon}
          onClick={closeCard}
          aria-label="close"
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
              aria-label="show amount"
              width={24}
              height={24}
            />
          ) : (
            <HideAmountIcon
              className={styles.hideIcon}
              onClick={toggleShowAmount}
              aria-label="hide amount"
              width={24}
              height={24}
            />
          )}
        </div>
        <Image
          className={styles.walletImage}
          src={WalletImage}
          alt="wallet"
          height={250}
          priority={true}
        />
        <div className={styles.cardWalletInfo}>
          <h1>Wallet Amount</h1>
          {isLoading ? (
            <Loader />
          ) : showAmount ? (
            <h2>Ksh. {amount ?? "N/A"}</h2>
          ) : (
            <div className={styles.hiddenAmount}></div>
          )}
        </div>
      </div>
      <div className={styles.walletController}>
        {["Deposit", "Withdraw"].map((type) => (
          <div
            key={type}
            className={`${styles.walletControllerBtn} ${
              transactionType === type ? styles.activeWalletBtn : ""
            }`}
            onClick={() => setTransactionType(type)}
          >
            {type === "Deposit" ? (
              <DepositIcon
                className={styles.walletIconB}
                aria-hidden="true"
                width={24}
                height={24}
              />
            ) : (
              <WithdrawIcon
                className={styles.walletIconB}
                aria-hidden="true"
                width={24}
                height={24}
              />
            )}
            <h5>{type}</h5>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className={styles.footerForm}>
        <div className={styles.formInputContain}>
          <div className={styles.formInputWrapper}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className={styles.formInput}>
              <PhoneIcon
                className={styles.formIcon}
                aria-hidden="true"
                width={30}
                height={30}
              />
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
                placeholder="07XXXXXXXX"
                maxLength={10}
              />
            </div>
          </div>

          <div className={styles.formInputWrapper}>
            <label htmlFor="transactionAmount">Amount</label>
            <div className={styles.formInput}>
              <AmountIcon
                className={styles.formIcon}
                aria-hidden="true"
                width={30}
                height={30}
              />
              <input
                type="text"
                id="transactionAmount"
                value={transactionAmount}
                onChange={handleAmountChange}
                required
                placeholder="Amount"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.formButton}
        >
          {isLoading ? <Loader /> : transactionType}
        </button>
      </form>
    </div>
  );
}
