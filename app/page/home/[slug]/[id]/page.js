"use client";

import { useRouter, usePathname, redirect } from "next/navigation";
import { useEffect } from 'react';

export default function PromotionPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract username and productCode from the pathname
    const pathParts = pathname.split('/');
    if (pathParts.length === 5) {
      const username = pathParts[3];
      const productCode = pathParts[4];

      if (username && productCode) {
        router.push(`/page/home?id=${productCode}`);
      }
    }
  }, [pathname, router]);


  return null;
}