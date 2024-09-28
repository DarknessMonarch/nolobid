"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/app/components/loader";
import { useState, useEffect } from "react";
import { useTimer } from "@/app/hooks/timer";
import { useProductStore } from "@/app/store/Product";
import styles from "@/app/styles/cardInformation.module.css";
import {
  BanknotesIcon as AmountIcon,
  PhoneIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function CardInformation() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { product, setProduct } = useProductStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

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
          },
        }
      );

      const data = await response.json();
      setProduct(data.data);
    } catch (error) {
      console.error("Error fetching product", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== "empty") {
      getProductsByID(id);
    }
  }, [searchParams]);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      // Handle the response data as needed
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const { timeLeft, isClient, formatTime } = useTimer(product?.expiryDate);

  if (!product) {
    return null; 
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardImageWrapper}>
        <div className={styles.cardImageTop}>
          <span>{product.productCode}</span>
          <CloseIcon
            className={styles.closeIcon}
            onClick={closeCard}
            alt="close icon"
            width={24}
            height={24}
          />
        </div>
        <div className={styles.productImageSlider}>
          {product.images?.map((image, index) => (
            <Image
              className={styles.cardImage}
              src={image.fileLink}
              alt={product.productName}
              width={200}
              height={200}
              priority={true}
              key={index}
            />
          ))}
          <div className={styles.imageSlider}>
            {product.images?.map((_, index) => (
              <div
                key={index}
                className={`${styles.circleAdv} ${
                  currentImageIndex === index ? styles.activeCircle : ""
                }`}
              ></div>
            ))}
          </div>
        </div>
        <div className={styles.cardImageInfo}>
          <h2>{product.productName}</h2>
          <p>{product.description}</p>
        </div>
      </div>
      <div className={styles.cardGlass}>
        <div className={styles.cardGlassInfo}>
          <h3>Bid Ending in: </h3>
          <span>{isClient ? formatTime(timeLeft) : "20 H :00 M: 00 S"}</span>
        </div>
        <hr className={styles.cardHr} />
        <div className={styles.cardGlassInfo}>
          <h3>Market Price: </h3> <span>{product.marketPrice}</span>
        </div>
      </div>
      <div className={styles.cardBottom}>
        {product.featureList?.map((feature, index) => (
          <div className={styles.cardBottomInfo} key={index}>
            <h3>{feature.featureProperty} </h3> <span>{feature.featureValue}</span>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className={styles.footerForm}>
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
  );
}