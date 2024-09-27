"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import tv from "@/public/assets/tv.png";
import ps5 from "@/public/assets/ps5.png";
import Loader from "@/app/components/loader";
import { useState, useEffect } from "react";
import { useTimer } from "@/app/hooks/timer";
import Iphone from "@/public/assets/iphone.png";
import Portable from "@/public/assets/portable.png";
import cardDataJson from "@/app/components/data.json";
import styles from "@/app/styles/cardInformation.module.css";
import {
  BanknotesIcon as AmountIcon,
  PhoneIcon as PhoneIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const imageMap = {
  tv,
  ps5,
  Iphone,
  Portable,
};

export default function CardInformation() {
  const { timeLeft, isClient, formatTime } = useTimer();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const Login = () => {
    toast.error("Please Login to start Promotion");
    router.push("/authentication/login", { scroll: false });
  };

  const closeCard = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("id");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
 

  const getProductsByID = async (id) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${SERVER_API}/products/public/single/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product", error);
    } finally {
      setIsLoading(false);
    }
  };

  <>
  {product.map((data, index) => (
    <div className={`${styles.cardContainer} ${styles.emptyCard} skeleton`} key={index}>
      <div className={styles.cardImageWrapper}>
        <div className={styles.cardImageTop}>
          <span>{data.id}</span>

          <CloseIcon
            className={styles.closeIcon}
            onClick={closeCard}
            alt="close icon"
            width={24}
            height={24}
          />
        </div>
        <Image
          className={styles.cardImage}
          src={imageMap[data.image]}
          alt={data.name}
          height={200}
          priority={true}
        />
        <div className={styles.cardImageInfo}>
          <h2>{data.name}</h2>
          <p>{data.description}</p>
        </div>
      </div>
      <div className={styles.cardGlass}>
        <div className={styles.cardGlassInfo}>
          <h3>Bid Ending in: </h3>{" "}
          <span>
            {isClient ? formatTime(timeLeft) : "20 H :00 M: 00 S"}
          </span>
        </div>{" "}
        <hr className={styles.cardHr} />
        <div className={styles.cardGlassInfo}>
          <h3>Market Price: </h3> <span>{data.marketPrice}</span>
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.cardBottomInfo}>
          <h3>Condition: </h3> <span>{data.condition}</span>
        </div>
        <div className={styles.cardBottomInfo}>
          <h3>Leading Price: </h3> <span>{data.leadingPrice}</span>
        </div>
        <div className={styles.cardBottomInfo}>
          <h3>Manufacturer Color: </h3> <span>{data.color}</span>
        </div>
        <div className={styles.cardBottomInfo}>
          <h3>SSD Capacity: </h3> <span>{data.storage}</span>
        </div>
        <div className={styles.cardBottomInfo}>
          <h3>Brand: </h3> <span>{data.brand}</span>
        </div>
        <div className={styles.cardBottomInfo}>
          <h3>Resolution: </h3> <span>{data.resolution}</span>
        </div>
        <div className={styles.cardBottomInfo}>
          <h3>Market Price: </h3> <span>{data.marketPrice}</span>
        </div>
      </div>
      <form onSubmit={onSubmit} className={styles.footerForm}>
        {/* Amount */}
        <div className={styles.formInput}>
          <AmountIcon
            className={styles.formIcon}
            alt="Amount icon"
            width={30}
            height={30}
          />
          <input
            type="text"
            name="Amount"
            required
            id="Amount"
            placeholder="10"
          />
        </div>
        <div className={styles.formInput}>
          <PhoneIcon
            className={styles.formIcon}
            alt="Phone icon"
            width={30}
            height={30}
          />
          <input
            type="text"
            name="Phone"
            id="Phone"
            required
            placeholder="07XXXXXXXX"
          />
        </div>
        <div className={styles.authBottomBtn}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formBidButton}
          >
            {isLoading ? <Loader /> : "Bid"}
          </button>
        </div>

        <div className={styles.formPromoteBtn} onClick={Login}>
          Promote
        </div>
      </form>
    </div>
  ))}
</>;
}
