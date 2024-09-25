"use client";

import { useState } from "react";
import Loader from "@/app/components/loader";
import styles from "@/app/styles/contact.module.css";

import {
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

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
        <button
          type="submit"
          disabled={isLoading}
          className={styles.formAuthButton}
        >
          {isLoading ? <Loader /> : "Contact Us"}
        </button>
        
      </div>
    </form>
  );
}
