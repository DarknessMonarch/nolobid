"use client";
import Image from "next/image";
import toast from "react-hot-toast";
import Infocard from "@/app/components/Services";
import FaqCard from "@/app/components/FaqCard";
import styles from "@/app/styles/about.module.css";

export default function TermsPage() {

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.introComponent}>
        <h1>Terms and Conditions for Nolobids</h1>
        <p></p>
      </div>
    </div>
  );
}
