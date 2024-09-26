"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/loader";
import LogoImg from "@/public/assets/logo.png";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";
import auth4Image from "@/public/assets/auth4Image.jpg";

import { QrCodeIcon as VerificationIcon } from "@heroicons/react/24/outline";

export default function Verify() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [verificationCode, setVerificationCode] = useState(""); 
  const [error, setError] = useState(""); 
  const router = useRouter();
  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const images = [auth1Image, auth2Image, auth3Image, auth4Image];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const validateForm = () => {
    if (!verificationCode) {
      setError("Verification code is required");
      return false;
    }
    if (verificationCode.length !== 5) {
      setError("Verification code must be exactly 5 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setVerificationCode(value);
    if (value.length > 5) {
      setError("Verification code must be exactly 5 characters long");
    } else {
      setError("");
    }
  };

  async function onSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${SERVER_API}/users/public/verify/${verificationCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Verification failed");
      }

      toast.success("Account verified");
      router.push("login", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Verification failed");
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
        <div className={styles.slideController}>
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
              alt="Verification code icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="verificationCode"
              id="verificationCode"
              placeholder="00000"
              value={verificationCode}
              onChange={handleInputChange}
              maxLength={5}
            />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
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
