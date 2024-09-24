"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import Loader from "@/app/components/loader";
import Profile from "@/public/assets/auth1Image.jpg";
import styles from "@/app/styles/settings.module.css";

import {
  KeyIcon as PasswordIcon,
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon as EditIcon } from "@heroicons/react/24/solid";

export default function SettingsPage() {
  const [accountType, setaccountType] = useState("promoter");
  const [profileImage, setProfileImage] = useState(Profile);
  const [username, setusername] = useState("penguin");
  const [isLoading, setIsLoading] = useState(false);

  const DeleteAccount = () => {};

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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    toggleAuth();
  }

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.mainComponent}>
      <div className={styles.settingComponent}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <h1>Account settings</h1>

          <div className={styles.settingWrap}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <div className={styles.profileSection}>
              <div className={styles.profileImageContain}>
                <Image
                  src={profileImage}
                  alt="Profile Image"
                  className={styles.profileImage}
                  width={100}
                  height={100}
                />
                <div
                  className={styles.uploadEditIcon}
                  onClick={handleIconClick}
                >
                  <EditIcon
                    className={styles.EditIcon}
                    alt="Edit Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className={styles.profileDetails}>
                <h2>{username}</h2>
                <span>{accountType}</span>
              </div>
            </div>
          </div>
          <div className={styles.settingWrapinfo}>
            <div className={styles.settingWrapS}>
              {/* Username */}
              <div className={styles.authInputContainer}>
                <label htmlFor="username" className={styles.authLabel}>
                  Username
                </label>
                <div className={styles.authInput}>
                  <UserNameIcon
                    className={styles.authIcon}
                    alt="Username icon"
                    width={16}
                    height={16}
                  />
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="nalojenga"
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
                    width={16}
                    height={16}
                  />
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="nolojenga@gmail.com"
                  />
                </div>
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
                  width={16}
                  height={16}
                />
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="+254796143149"
                />
              </div>
            </div>
            {/*  password */}
            <div className={styles.authInputContainer}>
              <label htmlFor="password" className={styles.authLabel}>
                password
              </label>
              <div className={styles.authInput}>
                <PasswordIcon
                  className={styles.authIcon}
                  alt="password icon"
                  width={16}
                  height={16}
                />
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="*********"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Update"}
            </button>
            <span onClick={DeleteAccount} className={styles.deleteAccount}>
              Delete account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
