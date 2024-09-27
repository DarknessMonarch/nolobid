"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import Loader from "@/app/components/loader";
import { useAuthStore } from "@/app/store/Auth";
import { useState, useEffect, useRef } from "react";
import Profile from "@/public/assets/auth1Image.jpg";
import styles from "@/app/styles/settings.module.css";
import toast from "react-hot-toast";

import {
  KeyIcon as PasswordIcon,
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon as EditIcon } from "@heroicons/react/24/solid";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState(Profile);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, username, email, profile, userType, setUser , clearUser, accessToken} = useAuthStore();
  const [formData, setFormData] = useState({
    username: username,
    email: email,
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuth) {
      redirect("/page/home");
    }
  }, [isAuth]);

  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (formData.phoneNumber && !/^2547\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in the format 2547xxxxxxxx";
    }
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      const formData = new FormData();
      formData.append('profilePic', file);

      try {
        const response = await fetch(`${SERVER_API}/users/update/profilepic`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(data.errors ||  'Failed to update profile picture' );
        }

        const data = await response.json();
        setUser({ profile: data.profilePic });
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Error updating profile picture:', error);
        toast.error('Failed to update profile picture');
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/users/update/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(data.errors || 'Failed to update user details');
      }

      const data = await response.json();
      setUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`${SERVER_API}/users/delete`, {
          method: 'DELETE',
          headers: {
           'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }

        toast.success('Account deleted successfully');
        clearUser();
        redirect("/page/home");
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <form onSubmit={updateProfile} className={styles.formSettingContainer}>
      <div className={styles.settingWrap}>
        <span>{userType}</span>

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
              src={profile === null ? profileImage : profile}
              alt="Profile Image"
              className={styles.profileImage}
              width={100}
              height={100}
            />
            <div className={styles.uploadEditIcon} onClick={handleIconClick}>
              <EditIcon
                className={styles.EditIcon}
                alt="Edit Icon"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className={styles.profileDetails}>
            <h1>{username}</h1>
            <h3>{email}</h3>
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
                width={20}
                height={20}
              />
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="noloblid"
              />
            </div>
            {errors.username && <p className={styles.errorText}>{errors.username}</p>}
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
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="noloblid@gmail.com"
              />
            </div>
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>
        </div>
        {/* Phone */}
        <div className={styles.authInputContainer}>
          <label htmlFor="phoneNumber" className={styles.authLabel}>
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
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="2547xxxxxxxx"
            />
          </div>
          {errors.phoneNumber && <p className={styles.errorText}>{errors.phoneNumber}</p>}
        </div>
        {/*  password */}
        <div className={styles.authInputContainer}>
          <label htmlFor="password" className={styles.authLabel}>
            Password
          </label>
          <div className={styles.authInput}>
            <PasswordIcon
              className={styles.authIcon}
              alt="password icon"
              width={20}
              height={20}
            />
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="*********"
            />
          </div>
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={styles.formAuthButton}
        >
          {isLoading ? <Loader /> : "Update"}
        </button>
        <span onClick={deleteAccount} className={styles.deleteAccount}>
          Delete account
        </span>
      </div>
    </form>
  );
}