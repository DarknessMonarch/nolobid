"use client";

import { useState, useEffect } from 'react';
import Wallet from '@/app/components/Wallet';
import styles from '@/app/styles/homelayout.module.css';
import CardInformation from '@/app/components/CardInformation';
import { useSearchParams } from "next/navigation";

export default function HomeLayout({ children }) {
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  const hasWalletParam = searchParams.get("wallet") !== null;
  const isWalletOpen = searchParams.get("wallet") === "open";
  const hasIdParam = searchParams.get("id") !== null && searchParams.get("id") !== '';

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const shouldShowSideContent = (hasWalletParam || hasIdParam) && (!isMobile || isWalletOpen || hasIdParam);

  const sideContentClasses = `
    ${styles.sideContent}
    ${isMobile && (isWalletOpen || hasIdParam) ? styles.slideIn : ''}
  `;

  return (
    <div className={styles.homeMain}>
      <div className={styles.content}>
        {children}
      </div>
      {shouldShowSideContent && (
        <div className={sideContentClasses}>
          {hasIdParam ? <CardInformation /> : <Wallet />}
        </div>
      )}
    </div>
  );
}
