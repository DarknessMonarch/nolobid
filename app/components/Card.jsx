"use client";

import Image from "next/image";
import tv from "@/public/assets/tv.png";
import ps5 from "@/public/assets/ps5.png";
import { useState, useEffect } from "react";
import { useTimer } from "@/app/hooks/timer";
import Iphone from "@/public/assets/iphone.png";
import styles from "@/app/styles/card.module.css";
import Portable from "@/public/assets/portable.png";
import { UserIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const imageMap = {
  tv,
  ps5,
  Iphone,
  Portable,
};

export default function Card() {
  const { timeLeft, isClient, formatTime } = useTimer();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
  const emptyCardCount = 20;

  const handleCardClick = (id) => {
    const params = new URLSearchParams(searchParams);
    params.delete("wallet");
    if (searchParams.get("id") !== id) {
      params.set("id", id);
    } else {
      params.delete("id");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // useEffect(() => {
  //   getProducts();
  // });

  const getProducts = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/products/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmptyCards = () => {
    return Array(emptyCardCount).fill(0).map((_, index) => (
      <div className={`${styles.cardContainer} ${styles.emptyCard} skeleton`} key={`empty-${index}`}>
 
      </div>
    ));
  };

  return (
    <div className={styles.cardMain}>
      {products.length === 0 ? (
        renderEmptyCards()
      ) : (
        <>
          {products.map((data, index) => (
            <div
              className={styles.cardContainer}
              key={index}
              onClick={() => handleCardClick(data.id)}
            >
              <div className={styles.cardImageWrapper}>
                <Image
                  className={styles.cardImage}
                  src={imageMap[data.image]}
                  alt={data.name}
                  height={120}
                  priority={true}
                />
                <div className={styles.cardImageInfo}>
                  <h2>{data.name}</h2>
                  <span>{data.id}</span>
                </div>
              </div>

              <div className={styles.cardGlass}>
                <div className={styles.cardGlassInfo}>
                  <h3>Bid Price:</h3> <span>{data.leadPrice}</span>
                </div>
                <hr className={styles.cardHr} />
                <div className={styles.cardGlassInfo}>
                  <h3>Market Price: </h3> <span>{data.marketPrice}</span>
                </div>
              </div>
              <div className={styles.cardBottom}>
                <div className={styles.cardBottomInfo}>
                  <ClockIcon
                    height={20}
                    width={20}
                    className={styles.sideNavIcon}
                  />
                  <h3>
                    {isClient ? formatTime(timeLeft) : "20 H :00 M: 00 S"}
                  </h3>
                </div>
                <div className={styles.cardBottomInfo}>
                  <UserIcon
                    height={20}
                    width={20}
                    className={styles.sideNavIcon}
                  />
                  <h3>{data.bidders}</h3>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}