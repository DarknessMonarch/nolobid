import Image from "next/image";
import toast from "react-hot-toast";
import styles from "@/app/styles/advert.module.css";
import { useState, useEffect, useCallback } from "react";
import Advert1Image from "@/public/assets/advert1.jpg";
import Advert2Image from "@/public/assets/advert2.jpg";
import Advert3Image from "@/public/assets/advert3.jpg";

export default function Banner() {
  const images = [Advert1Image, Advert2Image, Advert3Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);


  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  const startBidding = () => {
    toast.success("start bidding by selecting an item");
  };

  return (
    <div className={`${styles.advertComponent} skeleton `} >
      <Image
        className={styles.advertImage}
        src={images[currentImageIndex]}
        alt={`Advertisement ${currentImageIndex + 1}`}
        layout="fill"
        objectFit="cover"
        priority={true}
      />
      <div className={styles.bannerInfo} onClick={startBidding}>
        <h1>Win a new iPhone easily by bidding as <span>low</span>  as ksh 10 </h1>
        <button className={styles.buttonBanner}>
          Start bidding
        </button>
      </div>
      <div className={styles.imageSlider}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.circleAdv} ${
              currentImageIndex === index ? styles.activeCircle : ""
            }`}
            onClick={() => setCurrentImageIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}