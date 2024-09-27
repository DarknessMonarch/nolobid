"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/sidenav.module.css";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  HomeIcon,
  WalletIcon,
  BookOpenIcon as TermIcon,
  ChartPieIcon as DashBoardIcon,
  Cog8ToothIcon as SettingIcon,
  IdentificationIcon as ContactIcon,
  InformationCircleIcon as AboutIcon,
  ArrowRightStartOnRectangleIcon as LogoutIcon,
} from "@heroicons/react/24/outline";

export default function SideNavComponent() {
  const searchParams = useSearchParams();
  const { isAuth, clearUser } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const logOut = async () => {
    try {
      const response = await fetch(`${SERVER_API}/users/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
    }
  };

  const handleWallet = () => {
    if (pathname !== "/page/home") {
      router.push("/page/home", { scroll: false });
    } else {
      const params = new URLSearchParams(searchParams);
      const currentWalletState = params.get("wallet");

      params.delete("id");

      if (currentWalletState === "open") {
        params.delete("wallet");
      } else {
        params.set("wallet", "open");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };
  const isWalletOpen = () => {
    return searchParams.get("wallet") === "open";
  };

  const isActive = (path) => {
    if (isWalletOpen()) return "";
    return pathname === path ? styles.activesideNav : "";
  };

  return (
    <div className={styles.sideNavContainer}>
      <div className={styles.sideNavContainerTop}>
        <Link
          href="/page/home"
          className={`${styles.sideNavLinkContainer} ${
            isActive("/page/home") || isActive("/")
          }`}
        >
          <HomeIcon
            height={24}
            width={24}
            className={styles.sideNavIcon}
            alt="Home icon"
          />
        </Link>
        {isAuth ? (
          <div
            onClick={handleWallet}
            className={`${styles.sideNavLinkContainer} ${
              isWalletOpen() ? styles.activesideNav : ""
            }`}
          >
            <WalletIcon
              height={24}
              width={24}
              className={styles.sideNavIcon}
              alt="Wallet icon"
            />
          </div>
        ) : null}

        {isAuth ? (
          <Link
            href="/page/dashboard"
            className={`${styles.sideNavLinkContainer} ${isActive(
              "/page/dashboard"
            )}`}
          >
            <DashBoardIcon
              height={24}
              width={24}
              className={styles.sideNavIcon}
              alt="analytic icon"
            />
          </Link>
        ) : null}

        <Link
          href="/page/contact"
          className={`${styles.sideNavLinkContainer} ${isActive(
            "/page/contact"
          )}`}
        >
          <ContactIcon
            height={24}
            width={24}
            className={styles.sideNavIcon}
            alt="Contact icon"
          />
        </Link>
        <Link
          href="/page/terms"
          className={`${styles.sideNavLinkContainer} ${isActive(
            "/page/terms"
          )}`}
        >
          <TermIcon
            height={24}
            width={24}
            className={styles.sideNavIcon}
            alt="terms icon"
          />
        </Link>
        <Link
          href="/page/about"
          className={`${styles.sideNavLinkContainer} ${isActive(
            "/page/about"
          )}`}
        >
          <AboutIcon
            height={24}
            width={24}
            className={styles.sideNavIcon}
            alt="About icon"
          />
        </Link>
      </div>

      {isAuth ? (
        <>
          <div className={styles.sideNavContainerBottom}>
            <Link
              href="/page/settings"
              className={`${styles.sideNavLinkContainer} ${isActive(
                "/page/settings"
              )}`}
            >
              <SettingIcon
                height={24}
                width={24}
                className={styles.sideNavIcon}
                alt="Settings icon"
              />
            </Link>
            <div className={styles.sideNavBtn} onClick={logOut}>
              <LogoutIcon
                height={24}
                width={24}
                className={styles.sideNavIcon}
                alt="Logout icon"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
