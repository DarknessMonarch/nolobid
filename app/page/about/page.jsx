"use client";
import Image from "next/image";
import toast from "react-hot-toast";
import Services from "@/app/components/Services";
import FaqCard from "@/app/components/FaqCard";
import styles from "@/app/styles/about.module.css";

export default function AboutPage() {
  const questionsData = [
    {
      question: "What is Nolobid?",
      answer:
        "Nolobids is a dynamic online auction platform designed to revolutionize how products are promoted and sold.",
    },
    {
      question: "How do i place a bid?",

      answer:
        "To bid simply select product and place bid, place the amount you want and pay",
    },
    {
      question: "How many times can i bid?",

      answer:
        "You can place multiple bids of different amounts as many times as you want to maximise your chances of winning",
    },
    {
      question: "What happens after i bid?",

      answer:
        "You will recieve an SMS about your bid placement and an update if you were the lucky winner or not",
    },
  ];
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.introComponent}>
        <h1>About Nolobids</h1>
        <p>
          {" "}
         <span> Nolobids</span>  is a dynamic online auction platform designed to
          revolutionize how products are promoted and sold. <span>Our platform
          connects buyers and promoters</span>, allowing them to engage in exciting
          auctions, promote products, and earn commissions in a unique and
          innovative way.
        </p>
        <p>
          {" "}
          Our <span>mission</span>  is to create a transparent and competitive marketplace
          where users can place bids, promote products they believe in, and make
          profits by participating actively in the auction ecosystem. Whether
          you&apos;re looking to <span> buy something unique or become a promoter</span>,
          Nolobids is the place for you.
        </p>
      </div>

        <div className={styles.services}>
          <h2>Our Services</h2>
          <Services />
        </div>
        <div className={styles.help}>
          <h1>How Nolobid works</h1>
          <FaqCard />
          <div className={styles.questionsContainer}>
            <h2>Frequent questions</h2>
            {questionsData.map((data, index) => (
              <div className={styles.questionsWrapper} key={index}>
                <h3>{data.question}</h3>
                <p>{data.answer}</p>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
