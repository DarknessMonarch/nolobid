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

import {
  KeyIcon as PasswordIcon,
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  EyeIcon as ShowPasswordIcon,
  EyeSlashIcon as HidePasswordIcon,
  IdentificationIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";


export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  const images = [auth1Image, auth2Image, auth3Image, auth4Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

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

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;


  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.startsWith("254")) {
      return phoneNumber.slice(0, 12);
    } else if (phoneNumber.startsWith("0")) {
      return `254${phoneNumber.slice(1)}`.slice(0, 12);
    } else if (phoneNumber.startsWith("7")) {
      return `254${phoneNumber}`.slice(0, 12);
    }
    return `254${phoneNumber}`.slice(0, 12);
  };

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phoneNumber: formattedPhoneNumber }));
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^2547\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in the format 2547xxxxxxxx";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { phoneNumber } = formData;
      const response = await fetch(
        `${SERVER_API}/users/public/forgot/${phoneNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error getting reset code");
      }
      toast.success(data.message || "Reset code sent");
      router.push("forgot", { scroll: false });
    } catch (error) {
      toast.error(error.message || "Error getting reset code");
    } finally {
      setIsLoading(false);
    }
  };

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
          <div
            onClick={() =>
              setCurrentImageIndex((prev) => (prev + 1) % images.length)
            }
            className={styles.slideBtn}
          >
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
          <div
            onClick={() =>
              setCurrentImageIndex(
                (prev) => (prev - 1 + images.length) % images.length
              )
            }
            className={styles.slideBtn}
          >
            Previous
          </div>
        </div>
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
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
            <h1>Reset code password</h1>
            <p>Enter your phone number to get the code</p>
          </div>

          {/* Phone Number */}
          <div className={styles.authInput}>
            <PhoneIcon
              className={styles.authIcon}
              alt="Phone icon"
              width={20}
              height={20}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="2547xxxxxxxx"
              maxLength={12}
            />
          </div>
          {errors.phoneNumber && (
            <p className={styles.errorText}>{errors.phoneNumber}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Request code"}
          </button>

          <h3>
            Already have an account?{" "}
            <div
              className={styles.btnLogin}
              onClick={() => router.push("login", { scroll: false })}
            >
              Login
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}
