"use client";
import styles from "@/app/styles/terms.module.css";

export default function TermsPage() {
  return (
    <div className={styles.termContainer}>
        <h1>Terms and Conditions for Nolobids</h1>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Nolobids. By using our platform, you agree to comply with
          the following terms and conditions. These terms govern your
          participation in our auctions, including bidding, promotion, and
          referral programs. Please read carefully before using our services.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          To participate in auctions or to register as a promoter, you must:
        </p>
        <ul>
          <li>Be at least 18 years old.</li>
          <li>Have a valid Kenyan national ID.</li>
          <li>Have a registered M-Pesa number, which will be used for payments and payouts.</li>
          <li>Only maintain one account per individual.</li>
        </ul>

        <h2>3. Bidding Process</h2>
        <p>
          The auction operates on a Lowest Unique Bid model. The winner is the
          participant who places the lowest and most unique bid by the end of
          the auction.
        </p>
        <ul>
          <li>Each bid requires a non-refundable bidding fee, which varies based on the product and auction duration.</li>
          <li>Once placed, a bid cannot be canceled or refunded under any circumstances.</li>
          <li>The winner will be notified via their registered phone number.</li>
        </ul>

        <h3>Breakdown of the Lowest Unique Bid Concept</h3>
        <p>
          In a Lowest Unique Bid auction, the winner is determined not just by
          bidding the lowest amount but also by having the only bid at that
          amount.
        </p>
        <h4>1. Lowest Bid</h4>
        <p>This refers to the smallest monetary amount that has been bid in the auction. However, bidding the lowest amount does not guarantee a win.</p>
        <h4>2. Unique Bid</h4>
        <p>A bid is considered unique if no other participant has placed the same bid amount. If multiple participants place the same bid amount, it is no longer unique.</p>
        <h4>3. Winning Criteria</h4>
        <p>
          The winning bid must be the lowest amount that has been bid by only
          one participant (i.e., it is both the lowest and unique). If multiple
          people bid the same lowest amount, none of those bids are unique and
          are disqualified. The system will then look at the next lowest unique
          bid to determine the winner.
        </p>

        <h4>4. Example Scenario:</h4>
        <ul>
          <li>Participant A bids KES 2.</li>
          <li>Participant B bids KES 2.</li>
          <li>Participant C bids KES 3.</li>
          <li>Participant D bids KES 1.</li>
          <li>Participant E bids KES 3.</li>
        </ul>
        <p>
          In this case:
        </p>
        <ul>
          <li>KES 1 is the lowest bid, but if Participant D is the only one who placed this bid, it is both the lowest and unique bid. Therefore, Participant D wins.</li>
          <li>KES 2 is the second lowest bid, but because two participants (A and B) both bid KES 2, these bids are not unique and are disqualified.</li>
          <li>KES 3 is also disqualified because two participants (C and E) bid KES 3.</li>
        </ul>
        <p>
          So in this scenario, if KES 1 was not unique (e.g., if another
          participant had also bid KES 1), the system would move to the next
          lowest unique bid to declare the winner.
        </p>

        <h4>5. Key Takeaways:</h4>
        <ul>
          <li>Your goal as a bidder is to place the lowest bid that no one else has placed.</li>
          <li>If someone else bids the same amount, your bid is no longer unique, and you will not win.</li>
          <li>The winner is the person with the lowest amount that no one else bids.</li>
        </ul>

        <h2>4. Auction Types</h2>
        <p>
          Each auction may have different rules and durations, depending on the
          product being auctioned. Specific details term each auction, including
          the bidding fee and auction duration, will be displayed on the product page.
        </p>

        <h2>5. Promoters Program</h2>
        <p>
          Promoters are individuals who promote the products being auctioned on
          the platform. The following terms apply:
        </p>
        <ul>
          <li>Registration Fee: To become a promoter, you must pay a one-time fee of KES 500. This fee is non-refundable.</li>
          <li>Earnings: Promoters earn a percentage from products they successfully promote. A promoter will only earn if the products they promote receive actual bids. The percentage of earnings will be communicated in advance for each product.</li>
        </ul>

        <h2>6. Referral Program</h2>
        <p>
          Direct Referral: If a promoter refers another promoter (Promoter B) who
          registers and pays the KES 500 fee, the original promoter will earn KES
          200 from Promoter B&apos;s registration fee.
        </p>
        <p>
          Indirect Referral: If Promoter B refers another promoter (Promoter C),
          Promoter B will earn KES 200 from Promoter C’s registration fee, while
          the original promoter will earn KES 100.
        </p>

        <h2>7. Payments and Payouts</h2>
        <p>
          All payments, including bids and promoter fees, will be made through M-Pesa.
          Payouts to promoters will be made to the registered M-Pesa number. A
          promoter must have a valid M-Pesa number and can only register one account
          and one M-Pesa number.
        </p>

        <h2>8. One Account Policy</h2>
        <p>
          Each individual is allowed to have only one account on the platform, and
          each account must be associated with a single M-Pesa number. Attempting to
          create multiple accounts or registering with multiple M-Pesa numbers will
          result in the suspension or termination of all associated accounts.
        </p>

        <h2>9. No Refund Policy</h2>
        <p>
          Bidding fees and registration fees (for promoters) are non-refundable.
          Once a bid is placed, the fee is final and will not be refunded, regardless
          of the outcome of the auction.
        </p>

        <h2>10. Termination of Account</h2>
        <p>
          Nolobids reserves the right to terminate or suspend any account if the
          user is found violating the terms, including but not limited to:
        </p>
        <ul>
          <li>Creating multiple accounts.</li>
          <li>Engaging in fraudulent activities.</li>
          <li>Using false or misleading information during registration.</li>
        </ul>

        <h2>11. Limitation of Liability</h2>
        <p>
          Nolobids is not responsible for any losses, including financial, arising
          from the use of the platform. By participating, you accept full
          responsibility for your participation in auctions or promotion programs.
        </p>

        <h2>12. Privacy Policy</h2>
        <p>
          Your personal information, including your M-Pesa number, will be stored
          securely and used only for the purposes of facilitating payments and
          contacting you term the platform. We will not share your information with
          third parties without your consent.
        </p>

        <h2>13. Changes to Terms and Conditions</h2>
        <p>
          Nolobids reserves the right to update these terms and conditions at any
          time. Changes will be communicated via email or on the website. Continued
          use of the platform after changes constitutes your acceptance of the revised
          terms.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          These terms and conditions shall be governed by the laws of Kenya. Any
          disputes arising out of these terms shall be resolved through arbitration
          in accordance with Kenyan law.
        </p>

        <h3>Key Terms in the Terms and Conditions</h3>
        <ul>
          <li>Lowest Unique Bid: A type of auction where the winner is the person who places the lowest bid that no one else has placed. The bid must be unique and the lowest among all placed bids.</li>
          <li>Bidding Fee: A non-refundable fee paid by participants to place a bid in an auction.</li>
          <li>Promoter: An individual who promotes products on the platform and earns a commission from successful promotions.</li>
          <li>Direct Referral: The act of a promoter referring another individual to join as a promoter, earning a commission from their registration fee.</li>
          <li>One Account Policy: Users are allowed to register only one account on the platform, and the account must be associated with a single M-Pesa number.</li>
          <li>Non-Refundable: Indicates that payments made on the platform, including bidding fees and registration fees for promoters, cannot be refunded.</li>
          <li>Governing Law: The legal jurisdiction under which the terms and conditions are enforced, which in this case is Kenyan law.</li>
        </ul>
    </div>
  );
}
