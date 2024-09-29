"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import Loader from "@/app/components/loader";
import { useAuthStore } from "@/app/store/Auth";
import { useState, useEffect, useRef } from "react";
import Profile from "@/public/assets/auth1Image.jpg";
import styles from "@/app/styles/settings.module.css";

import {
  PhoneIcon,
  KeyIcon as PasswordIcon,
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  EyeIcon as ShowPasswordIcon,
  QrCodeIcon as VerificationIcon,
  EyeSlashIcon as HidePasswordIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon as EditIcon } from "@heroicons/react/24/solid";

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState(Profile);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isAuth,
    username,
    email,
    profile,
    userType,
    setUser,
    clearUser,
    accessToken,
    authorized,
  } = useAuthStore();
  const [formData, setFormData] = useState({
    username: username,
    email: email,
    phoneNumber: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    verificationCode: "",
  });

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuth) {
      redirect("/page/home");
    }
  }, [isAuth]);

  const fileInputRef = useRef(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)"
      );
    }
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (formData.phoneNumber && !/^254\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in the format 2547xxxxxxxx";
    }
    if (formData.newPassword) {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors;
      }
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && !value.startsWith("254")) {
      setFormData((prev) => ({ ...prev, [name]: "254" + value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB size limit
        toast.error("Please upload an image smaller than 5MB.");
        return;
      }
  
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
  
      const formData = new FormData();
      formData.append("profile_pic", file);
  
      try {
        const response = await fetch(`${SERVER_API}/users/update/profilepic`, {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
  
        if (response.status === 201) {
          toast.success("Profile pic updated successfully");
  
          const data = await response.json().catch(() => null); 
          if (data && data.profile_pic) {
            setUser({ profile: data.profile_pic });
          }
        } else if (response.status === 413) {
          toast.error("File is too large. Please upload an image smaller than 5MB.");
        } else {
          throw new Error("Unexpected response format. Please try again.");
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error(error.message || "Failed to update profile picture");
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/users/update/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast.success("Password updated successfully");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePhoneNumber = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/users/update/phoneNumber`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          verificationCode: formData.verificationCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update phone number");
      }

      toast.success("Phone number updated successfully");
      setFormData((prev) => ({
        ...prev,
        phoneNumber: "",
        verificationCode: "",
      }));
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast.error("Failed to update phone number");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formSettingContainer}>
      <div className={styles.formSettingMain}>
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
              src={profile === null ? profileImage : profile}
              alt={username}
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
            <div className={styles.profileGlass}>
              <h3>{email}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.settingWrapinfo}>
        
        <form onSubmit={updateProfile} className={styles.settingWrapS}>
          <div className={styles.settingInputContainer}>
            <label htmlFor="username" className={styles.settingLabel}>
              Username
            </label>
            <div className={styles.settingInput}>
              <UserNameIcon
                className={styles.settingIcon}
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
            {errors.username && (
              <p className={styles.errorText}>{errors.username}</p>
            )}
          </div>

          <div className={styles.settingInputContainer}>
            <label htmlFor="email" className={styles.settingLabel}>
              Email
            </label>
            <div className={styles.settingInput}>
              <EmailIcon
                className={styles.settingIcon}
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

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formsettingButton}
          >
            {isLoading ? <Loader /> : "Update Profile"}
          </button>
        </form>

     
        <form onSubmit={updatePhoneNumber} className={styles.settingWrapS}>
          <div className={styles.settingInputContainer}>
            <label htmlFor="verificationCode" className={styles.settingLabel}>
              Verification Code
            </label>
            <div className={styles.settingInput}>
              <VerificationIcon
                className={styles.settingIcon}
                alt="Verification code icon"
                width={20}
                height={20}
              />
              <input
                type="text"
                name="verificationCode"
                id="verificationCode"
                placeholder="00000"
                value={formData.verificationCode}
                onChange={handleInputChange}
                maxLength={5}
              />
            </div>
          {errors.verificationCode && (
            <p className={styles.errorText}>{errors.verificationCode}</p>
          )}
          
          </div>
          <div className={styles.settingInputContainer}>
            <label htmlFor="phoneNumber" className={styles.settingLabel}>
              Phone Number
            </label>
            <div className={styles.settingInput}>
              <PhoneIcon
                className={styles.settingIcon}
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
            {errors.phoneNumber && (
              <p className={styles.errorText}>{errors.phoneNumber}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formsettingButton}
          >
            {isLoading ? <Loader /> : "Update Phone Number"}
          </button>
        </form>
        <form onSubmit={updatePassword} className={styles.settingWrapS}>
          <div className={styles.settingInputContainer}>
            <label htmlFor="oldPassword" className={styles.settingLabel}>
              Old Password
            </label>
            <div className={styles.settingInput}>
              <PasswordIcon
                className={styles.settingIcon}
                alt="password icon"
                width={20}
                height={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Old Password"
              />
                 <button
                type="button"
                className={styles.showBtn}
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <ShowPasswordIcon
                    className={styles.settingIcon}
                    width={20}
                    height={20}
                  />
                ) : (
                  <HidePasswordIcon
                    className={styles.settingIcon}
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>
          </div>

          <div className={styles.settingInputContainer}>
            <label htmlFor="newPassword" className={styles.settingLabel}>
              New Password
            </label>
            <div className={styles.settingInput}>
              <PasswordIcon
                className={styles.settingIcon}
                alt="password icon"
                width={20}
                height={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
              />
                 <button
                type="button"
                className={styles.showBtn}
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <ShowPasswordIcon
                    className={styles.settingIcon}
                    width={20}
                    height={20}
                  />
                ) : (
                  <HidePasswordIcon
                    className={styles.settingIcon}
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>
            {errors.newPassword && Array.isArray(errors.newPassword) && (
              <ul className={styles.errorList}>
                {errors.newPassword.map((error, index) => (
                  <li key={index} className={styles.errorText}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.settingInputContainer}>
            <label htmlFor="confirmNewPassword" className={styles.settingLabel}>
              Confirm New Password
            </label>
            <div className={styles.settingInput}>
              <PasswordIcon
                className={styles.settingIcon}
                alt="password icon"
                width={20}
                height={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                placeholder="Confirm New Password"
              />
              <button
                type="button"
                className={styles.showBtn}
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <ShowPasswordIcon
                    className={styles.settingIcon}
                    width={20}
                    height={20}
                  />
                ) : (
                  <HidePasswordIcon
                    className={styles.settingIcon}
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className={styles.errorText}>{errors.confirmNewPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formsettingButton}
          >
            {isLoading ? <Loader /> : "Update Password"}
          </button>
          <div className={styles.accountStatus}>
          <span>
            {userType} Account status: {authorized ? "Approved" : "Pending"}
          </span>
        </div>
        </form>

       
      </div>
      </div>
     
    </div>
  );
}
            