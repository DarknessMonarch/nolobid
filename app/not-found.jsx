"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import NotFoundAnimated from "@/public/assets/404.gif";
import styles from "@/app/styles/notfound.module.css";

export default function NotFound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/page/home");
  };

  return (
    <div className={styles.notFound}>
      <Image
        className={styles.notFoundImg}
        src={NotFoundAnimated}
        height={300}
        alt="Not found image"
        priority={true}
      />
      <h1>Page not found</h1>
     <button className={styles.notFoundBtn} onClick={goHome}>
     Return home
     </button>
    </div>
  );
}
