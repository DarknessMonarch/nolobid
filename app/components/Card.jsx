import Image from "next/image";
import { useTimer } from "@/app/hooks/timer";
import { useState, useEffect } from "react";
import styles from "@/app/styles/card.module.css";
import { useProductsStore } from "@/app/store/Products";
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const ProductCard = ({ data, handleCardClick }) => {
  const { timeLeft, isClient, formatTime } = useTimer(data.expiryDate);

  

  return (
    <div
      className={styles.cardContainer}
      onClick={() => handleCardClick(data.productCode)}
    >
      <div className={styles.cardImageWrapper}>
        <Image
          className={styles.cardImage}
          src={data.images?.[0]?.fileLink}
          alt={data.productName}
          height={120}
          width={120}
          priority={true}
        />
        <div className={styles.cardImageInfo}>
          <h2>{data.productName}</h2>
          <span>{data.productCode}</span>
        </div>
      </div>

      <div className={styles.cardGlass}>
        <div className={styles.cardGlassInfo}>
          <h3>Bid Price:</h3> <span>{data.bidPrice}</span>
        </div>
        <hr className={styles.cardHr} />
        <div className={styles.cardGlassInfo}>
          <h3>Market Price: </h3> <span>{data.marketPrice}</span>
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.cardBottomInfo}>
          <ClockIcon height={20} width={20} className={styles.sideNavIcon} />
          <h3>{isClient ? formatTime(timeLeft) : "20 D : 60 H :00 M: 00 S"}</h3>
        </div>
        <div className={styles.cardBottomInfo}>
          <UserIcon height={20} width={20} className={styles.sideNavIcon} />
          <h3>{data.bidders || 0}</h3>
        </div>
      </div>
    </div>
  );
};

export default function Card() {
  const { setProducts, products } = useProductsStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
  const emptyCardCount = 20;
  const searchKey = searchParams.get("q") || "";

  useEffect(() => {
    getProducts();
  }, []);
  
  

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_API}/products/public/active`, {
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

  const searchProducts = searchKey
    ? products.filter((item) =>
        item.productName.toLowerCase().includes(searchKey.toLowerCase()) || item.productCode.toLowerCase().includes(searchKey.toLowerCase())
      )
    : products;

  const renderEmptyCards = () => {
    return Array(emptyCardCount)
      .fill(0)
      .map((_, index) => (
        <div
          onClick={() => handleCardClick("empty")}
          className={`${styles.cardContainer} ${styles.emptyCard} skeleton`}
          key={`empty-${index}`}
        ></div>
      ));
  };

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

  return (
    <div className={styles.cardMain}>
      {searchProducts.length === 0 || isLoading ? (
        renderEmptyCards()
      ) : (
        <>
          {searchProducts.map((data, index) => (
            <ProductCard
              key={index}
              data={data}
              handleCardClick={handleCardClick}
            />
          ))}
        </>
      )}
    </div>
  );
}
