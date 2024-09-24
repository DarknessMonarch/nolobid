"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/loader";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";
import auth4Image from "@/public/assets/auth4Image.jpg";


import {
  QrCodeIcon as VerificationIcon,
} from "@heroicons/react/24/outline";

export default function Forgot() {
  const [isLoading, setIsLoading] = useState(false);

  
  const images = [auth1Image, auth2Image, auth3Image, auth4Image];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentImageIndex]);


  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      // const response = await fetch("/api/submit", {
      //   method: "POST",
      //   body: formData,
      // });

      toast.success("Account verified")
      router.push("/page/dashboard", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error("reset failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authComponent}>
     <div className={styles.authComponentBgImage}>
        <Image
          className={styles.authImage}
          src={images[currentImageIndex]}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority={true}
        />
        <div class={styles.slideController}>
          <div onClick={nextImage} className={styles.slideBtn}>
            Next
          </div>
          <div className={styles.imageSlider}>
            {images.map((_, index) => (
              <div
                key={index}
                className={`${styles.circleAdv} ${
                  currentImageIndex === index ? styles.activeCircle : ""
                }`}
              ></div>
            ))}
          </div>
          <div onClick={prevImage} className={styles.slideBtn}>
            Previous
          </div>
        </div>
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
        <div className={styles.formLogo}>
          <Image
            className={styles.logo}
            src={LogoImg}
            alt="logo"
            width={50}
            priority={true}

          />
          </div>
          <div className={styles.formHeader}>
            <h1>Verify</h1>
            <p>Enter your verification code</p>
          </div>
          {/* Verification code */}

          <div className={styles.authInput}>
            <VerificationIcon
              className={styles.authIcon}
              alt="Verification icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="Verification"
              id="Verification"
              placeholder="000 000 000"
            />
          </div>
          <div className={styles.authBottomBtn}>
               <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Verify your account"}
          </button>
          </div> 
         
        </form>
      </div>
    </div>
  );
}
