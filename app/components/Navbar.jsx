"use client";

import Image from "next/image";
import debounce from "lodash.debounce";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/navbar.module.css";
import ProfileImg from "@/public/assets/auth1Image.jpg";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  UserIcon,
  WalletIcon,
  EyeIcon as ShowAmountIcon,
  EyeSlashIcon as HideAmountIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowLeftEndOnRectangleIcon as LogoutIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isSearching, setIsSearching] = useState(false);
  const [username, setUsername] = useState("penguin");
  const [showAmount, setShowAmount] = useState(false);
  const { isAuth, toggleAuth } = useAuthStore();
  const [amount, setAmount] = useState(1000000);
  const [search, setSearch] = useState("");
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

  const updateAmount = () => {
    setAmount(10);
  };

  const performSearch = useMemo(
    () =>
      debounce((searchValue) => {
        const params = new URLSearchParams(searchParams);
        if (searchValue) {
          params.set("q", searchValue);
        } else {
          params.delete("q");
        }
        setIsSearching(false);
        router.replace(`${pathname}?${params.toString()}`);
      }, 300),
    [searchParams, router, pathname]
  );

  useEffect(() => {
    setIsSearching(search.trim() !== "");
    performSearch(search.trim());

    return () => performSearch.cancel();
  }, [search, performSearch]);

  const handleInputChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleAuth = useCallback(() => {
    toggleAuth();
    if (isAuth) {
      localStorage.removeItem("token");
    } else {
      router.push("/authentication/login", { scroll: false });
    }
  }, [isAuth, toggleAuth, router]);

  return (
    <div className={styles.navMain}>
      <div className={styles.navContainer}>
        <div className={styles.navContainerTop}>
          <Image
            className={styles.logo}
            src={LogoImg}
            alt="logo"
            width={50}
            priority={true}
          />
          {pathname === "/page/home" ? (
            <div className={styles.searchContainer}>
              <SearchIcon
                className={styles.searchIcon}
                height={24}
                alt="Search icon"
              />
              <input
                type="text"
                value={search}
                onChange={handleInputChange}
                placeholder="Search ..."
                className={styles.searchInput}
              />
            </div>
          ) : null}
        </div>
        <div className={styles.navContainerBottom}>
          <div className={styles.wallet}>
            {showAmount ? (
              <WalletIcon
                className={styles.walletIcon}
                height={20}
                alt="wallet icon"
              />
            ) : null}
            {showAmount ? <span>Ksh {amount}</span> : null}

            {showAmount ? (
              <ShowAmountIcon
                className={styles.showIcon}
                onClick={toggleShowAmount}
                alt="show icon"
                width={20}
                height={20}
              />
            ) : (
              <HideAmountIcon
                className={styles.hideIcon}
                onClick={toggleShowAmount}
                alt="hide icon"
                width={20}
                height={20}
              />
            )}
          </div>
          {isAuth ? (
            <button onClick={handleAuth} className={styles.btnContainer}>
              <UserIcon
                className={styles.navIcon}
                height={20}
                alt="login icon"
              />
              Login
            </button>
          ) : (
            <>
              <div className={styles.userProfile}>
                <Image
                  src={ProfileImg}
                  height={35}
                  alt="profile image"
                  priority={true}
                  className={styles.profileImg}
                />
                <div className={styles.userDetails}>
                  <h1>{username}</h1>
                </div>
              </div>
              <div onClick={handleAuth} className={styles.btnContainer}>
                <LogoutIcon
                  height={20}
                  width={20}
                  className={styles.logutNavIcon}
                  alt="logout icon"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {pathname === "/page/home" ? (
        <div className={styles.searchContainer}>
          <SearchIcon
            className={styles.searchIcon}
            height={24}
            alt="Search icon"
          />
          <input
            type="text"
            value={search}
            onChange={handleInputChange}
            placeholder="Search ..."
            className={styles.searchInput}
          />
        </div>
      ) : null}
    </div>
  );
}
