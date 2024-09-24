"use client";
import Card from "@/app/components/Card";
import Advert from "@/app/components/Advert";
import styles from "@/app/styles/home.module.css";

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      <Advert />
      <h1>Top Bids</h1>
      <Card />
    </div>
  );
}
