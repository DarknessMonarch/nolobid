"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import Loader from "@/app/components/loader";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/navbar.module.css";
import { useWalletStore } from "@/app/store/Wallet";
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
  const { amount, showAmount, toggleShowAmount } = useWalletStore();
  const { isAuth, username, clearUser, accessToken } = useAuthStore();
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

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

  const logOut = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/users/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      clearUser();
      toast.success("Logout Sucessfully");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    router.push("/authentication/login", { scroll: false });
  };

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
          {pathname === "/page/home" && (
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
          )}
        </div>
        <div className={styles.navContainerBottom}>
          {isAuth ? (
            <>
              <div className={styles.wallet}>
                {showAmount ? null : (
                  <HideAmountIcon
                    className={styles.hideIcon}
                    onClick={toggleShowAmount}
                    alt="show icon"
                    width={20}
                    height={20}
                  />
                )}

                {showAmount && (
                  <>
                    <WalletIcon
                      className={styles.walletIcon}
                      height={20}
                      alt="wallet icon"
                    />
                    <span>Ksh {amount?.toLocaleString()}</span>
                    <ShowAmountIcon
                      className={styles.showIcon}
                      onClick={toggleShowAmount}
                      alt="hide icon"
                      width={20}
                      height={20}
                    />
                  </>
                )}
              </div>

              <div className={styles.userProfile}>
                <Image
                  src={ProfileImg}
                  height={35}
                  alt="profile image"
                  priority={true}
                  className={styles.profileImg}
                />
                <div className={styles.userDetails}>
                  <h1>Monarch</h1>
                </div>
              </div>
              <div
                onClick={logOut}
                className={`${styles.btnContainer} ${styles.logoutBtn}`}
              >
                {isLoading ? (
                  <Loader />
                ) : (
                  <LogoutIcon
                    height={20}
                    width={20}
                    className={styles.logoutNavIcon}
                    alt="logout icon"
                  />
                )}
              </div>
            </>
          ) : (
            <button
              onClick={login}
              disabled={isLoading}
              className={styles.btnContainer}
            >
              <UserIcon
                className={styles.navIcon}
                height={20}
                alt="login icon"
              />
              Login
            </button>
          )}
        </div>
      </div>
      {pathname === "/page/home" && (
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
      )}
    </div>
  );
}
