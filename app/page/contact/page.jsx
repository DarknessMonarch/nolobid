"use client";

import Image from "next/image";
import { useState } from "react";
import Loader from "@/app/components/loader";
import styles from "@/app/styles/contact.module.css";

//social icons
import Instagram from "@/public/icons/instagram.svg";
import Whatsapp from "@/public/icons/whatsapp.svg";
import linkedIn from "@/public/icons/linkedIn.svg";
import Telegram from "@/public/icons/telegram.svg";
import Twitter from "@/public/icons/twitter.svg";
import Youtube from "@/public/icons/youtube.svg";

import {
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const socialData = [
    {
      name: "Twitter",
      icons: Twitter,
      link: "https://twitter",
    },
    {
      name: "Youtube",
      icons: Youtube,
      link: "https://youtube",
    },
    {
      name: "Telegram",
      icons: Telegram,
      link: "https://telegram",
    },
    {
      name: "linkedIn",
      icons: linkedIn,
      link: "https://linkedIn",
    },
    {
      name: "Whatsapp",
      icons: Whatsapp,
      link: "https://whatsapp",
    },
    {
      name: "Instagram",
      icons: Instagram,
      link: "https://instagram",
    },
  ];

  const openLink = (link) => {
    window.open(`${link}`, "_blank");
  };

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

  return (
    <form onSubmit={onSubmit} className={styles.formContactContainer}>
      <div className={styles.contactWrapinfo}>
        {/* Username */}
        <div className={styles.authInputContainer}>
          <label htmlFor="username" className={styles.authLabel}>
            Username
          </label>
          <div className={styles.authInput}>
            <UserNameIcon
              className={styles.authIcon}
              alt="Username icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="noloblid"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className={styles.authInputContainer}>
          <label htmlFor="email" className={styles.authLabel}>
            Email
          </label>
          <div className={styles.authInput}>
            <EmailIcon
              className={styles.authIcon}
              alt="email icon"
              width={20}
              height={20}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="noloblid@gmail.com"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className={styles.authInputContainer}>
          <label htmlFor="phone" className={styles.authLabel}>
            Phone Number
          </label>
          <div className={styles.authInput}>
            <PhoneIcon
              className={styles.authIcon}
              alt="phone icon"
              width={20}
              height={20}
            />
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="07xxxxxxxx"
              required
            />
          </div>
        </div>

        {/* Message */}
        <div className={styles.authInputContainer}>
          <label htmlFor="message" className={styles.authLabel}>
            Message
          </label>
          <div className={styles.authInput}>
            <textarea
              name="message"
              id="message"
              placeholder="Enter your message"
              rows="4"
              required
            ></textarea>
          </div>
        </div>
        <div className={styles.formAuthBtnWrapper}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Contact Us"}
          </button>
          <div className={styles.socialContainer}>
            {socialData.map((data, index) => (
              <div
                className={styles.socialIconWrap}
                key={index}
                onClick={() => openLink(data.link)}
              >
                <Image
                  className={styles.socialIcon}
                  src={data.icons}
                  alt={data.name}
                  height={24}
                  priority={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
