"use client";
import Image from "next/image";
import { useProductsStore } from "@/app/store/Products";
import styles from "@/app/styles/referrals.module.css";

export default function Links() {
  const { products } = useProductsStore();


  return (
    <div className={styles.referralContainer}>
      <div className={styles.referralHeader}>
        <h1>Links</h1>
        <p>You have promoted {products.length} products this months</p>
      </div>
      {products.map((data, index) => (
        <div className={styles.referralContainerWrapper} key={index}>
          <Image
            className={styles.referralImage}
            src={data.images?.[0]?.fileLink}
            alt={data.productName}
            height={120}
            width={120}
            priority={true}
          />
          <div className={styles.referralImageInfo}>
            <div className={styles.referralImageInfoWrapper}>
              <h2>{data.productName}</h2>
              <span>{data.productCode}</span>
            </div>
            <p>+100</p>
          </div>
        </div>
      ))}
    </div>
  );
}
