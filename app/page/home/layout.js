"use client";

import { useState, useEffect } from 'react';
import Wallet from '@/app/components/Wallet';
import { useSearchParams } from "next/navigation";
import { useProductStore } from "@/app/store/Product";
import styles from '@/app/styles/homeLayout.module.css';
import CardInformation from '@/app/components/CardInformation';

export default function HomeLayout({ children }) {
  const { product } = useProductStore();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const isEmpty = searchParams.get('id') === "empty";
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
  
  const isProductEmpty = Array.isArray(product) ? product.length === 0 : !product;

  const sideContentClasses = `
    ${styles.sideContent}     
    ${isMobile && (isWalletOpen || hasIdParam) ? styles.slideIn : ''}
    ${isEmpty && isProductEmpty ? `${styles.emptyCard} skeleton` : ''}
  `.trim();

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