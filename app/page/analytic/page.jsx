"use client";

import Image from "next/image";
import { useState } from "react";
import Loader from "@/app/components/loader";
import styles from "@/app/styles/contact.module.css";

import {
  UserIcon as UserNameIcon,
  EnvelopeIcon as EmailIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function AnalyticPage() {
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
   <div>

   </div>
  );
}
