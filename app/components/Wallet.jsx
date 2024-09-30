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
  const { amount, showAmount, toggleShowAmount, setAmount } = useWalletStore();
  const [transactionType, setTransactionType] = useState("Deposit");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, accessToken, authorized } = useAuthStore();
  const [errors, setErrors] = useState({});

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const closeCard = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("wallet");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handlePhoneNumberChange = useCallback((e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("254")) {
      value = "254" + value.replace(/^0+/, "");
    }
    setPhoneNumber(value.slice(0, 12));
  }, []);

  const handleAmountChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "");
    setTransactionAmount(value);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!transactionAmount.trim()) newErrors.amount = "Amount is required";
    if (transactionAmount.trim() === "0") newErrors.amount = "0 is not allowed";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!/^254\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in the format 254xxxxxxxxx";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [transactionAmount, phoneNumber]);

  const fetchWalletBalance = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_API}/wallet/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch balance");
      const data = await response.json();
      setAmount(data.data);
    } catch (error) {
      toast.error("Failed to fetch wallet balance");
    }
  }, [SERVER_API, accessToken, setAmount]);

  const requestAuthorization = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_API}/users/authorize`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to request authorization");

      const data = await response.json();
      toast.success(data.data);
      if (authorized) {
        toast.success("Authorization successful");
        fetchWalletBalance();
      } else {
        toast.info("Authorization pending. login again to view balance");
      }
    } catch (error) {
      toast.error("Failed to request authorization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [SERVER_API, accessToken, authorized, fetchWalletBalance]);

  useEffect(() => {
    if (isAuth && authorized) {
      fetchWalletBalance();
    }
  }, [isAuth, authorized, requestAuthorization, fetchWalletBalance]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isAuth) {
        toast.error("Please log in to perform transactions");
        return;
      }

      if (!authorized) {
        toast.error("You are not authorized to perform transactions");
        return;
      }

      if (!validateForm()) return;

      setIsLoading(true);
      try {
        const amountValue = parseInt(transactionAmount);
        if (amountValue < 1) {
          setErrors((prev) => ({ ...prev, amount: "Minimum amount is 1 Ksh" }));
          return;
        }

        let endpoint =
          transactionType === "Deposit"
            ? `wallet/topup/${amountValue}`
            : `wallet/withdraw/${amountValue}`;

        const response = await fetch(`${SERVER_API}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: amountValue,
            phoneNumber: phoneNumber,
          }),
        });

        const data = await response.json();

        if (data.responsecode === "00") {
          if (transactionType === "Deposit") {
            toast.success(
              `${data.data} for Ksh. ${amountValue.toLocaleString()}`
            );
          } else {
            toast.success(
              `${transactionType}ed Ksh. ${amountValue.toLocaleString()}`
            );
          }
          setTransactionAmount("");
          setPhoneNumber("");
        } else if (
          data.responsecode === "01" &&
          data.errors &&
          data.errors.length > 0
        ) {
          toast.error(data.errors[0]);
        } else {
          throw new Error(`Failed to ${transactionType.toLowerCase()}`);
        }
        fetchWalletBalance();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      transactionType,
      transactionAmount,
      phoneNumber,
      isAuth,
      authorized,
      fetchWalletBalance,
      accessToken,
      SERVER_API,
      validateForm,
    ]
  );
  if (!isAuth) {
    return (
      <div className={styles.walletAccess}>
        <h2>Please log in to access your wallet.</h2>{" "}
      </div>
    );
  }

  if (!authorized) {
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
          <Image
            className={styles.walletImage}
            src={WalletImage}
            alt="wallet"
            height={250}
            priority={true}
          />
          <div className={styles.cardWalletInfo}>
            <h1>N/A</h1>
          </div>
        </div>
        <div className={styles.unauthorizedInfo}>
          <h2>Wallet Access Unauthorized</h2>
          <p>You need to pay for authorization to access your wallet.</p>
        </div>

        <button
          onClick={requestAuthorization}
          className={styles.formButton}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Pay for authorization"}
        </button>
      </div>
    );
  }

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
            <h2>Ksh. {amount ? amount.toLocaleString() : "N/A"}</h2>
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
            aria-label={`Select ${type} transaction type`}
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
            <h3>{type}</h3>
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
                placeholder="254xxxxxxxxx"
                maxLength={12}
              />
            </div>
            {errors.phoneNumber && (
              <span className={styles.error}>{errors.phoneNumber}</span>
            )}
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
            {errors.amount && (
              <span className={styles.error}>{errors.amount}</span>
            )}
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
