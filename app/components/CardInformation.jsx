import Image from "next/image";
import toast from "react-hot-toast";
import PopUp from "@/app/components/Popup";
import Loader from "@/app/components/loader";
import { useTimer } from "@/app/hooks/timer";
import { useAuthStore } from "@/app/store/Auth";
import { useProductStore } from "@/app/store/Product";
import { useState, useEffect, useCallback } from "react";
import styles from "@/app/styles/cardInformation.module.css";
import {
  LinkIcon,
  PhoneIcon,
  ShareIcon,
  NoSymbolIcon as NotFoundIcon,
  XMarkIcon as CloseIcon,
  BanknotesIcon as BidIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

//social icons
import Instagram from "@/public/icons/instagram.svg";
import Whatsapp from "@/public/icons/whatsapp.svg";
import linkedIn from "@/public/icons/linkedIn.svg";
import Telegram from "@/public/icons/telegram.svg";
import Twitter from "@/public/icons/twitter.svg";
import Youtube from "@/public/icons/youtube.svg";

export default function CardInformation() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { product, setProduct } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, username } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const [formData, setFormData] = useState({
    bidAmount: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const handlePromote = () => {
    if (!isAuth) {
      router.push("/authentication/login", { scroll: false });
    } else {
      toggleIsOpen();
    }
  };

  const closeCard = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("id");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getProductsByID = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${SERVER_API}/products/public/single/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (
          data.responsecode === "01" &&
          data.errors &&
          data.errors.includes("Product not found")
        ) {
          setError("Product not found");
        } else {
          setProduct(data.data);
        }
      } else {
        throw new Error(data.message || "Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product", error);
      setError(error.message || "An error occurred while fetching the product");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== "empty") {
      getProductsByID(id);
    }
  }, [searchParams]);

  const nextImage = useCallback(() => {
    if (product?.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  }, [product]);

  useEffect(() => {
    const intervalId = setInterval(nextImage, 5000); // Change image every 5 seconds
    return () => clearInterval(intervalId);
  }, [nextImage]);

  const handleCircleClick = (index) => {
    setCurrentImageIndex(index);
  };

  const generateShareLink = useCallback(() => {
    if (product && username) {
      const link = `https://nolobid.vercel.app/page/home${username}/${product.productCode}`;
      setShareLink(link);
    }
  }, [product, username]);

  useEffect(() => {
    generateShareLink();
  }, [generateShareLink]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const openSocialLink = (baseUrl) => {
    window.open(`${baseUrl}${encodeURIComponent(shareLink)}`, "_blank");
  };

  const socialData = [
    {
      name: "Twitter",
      icons: Twitter,
      link: "https://twitter.com/intent/tweet?url=",
    },
    {
      name: "Youtube",
      icons: Youtube,
      link: "https://www.youtube.com/share?url=",
    },
    { name: "Telegram", icons: Telegram, link: "https://t.me/share/url?url=" },
    {
      name: "linkedIn",
      icons: linkedIn,
      link: "https://www.linkedin.com/sharing/share-offsite/?url=",
    },
    {
      name: "Whatsapp",
      icons: Whatsapp,
      link: "https://api.whatsapp.com/send?text=",
    },
    {
      name: "Instagram",
      icons: Instagram,
      link: "https://www.instagram.com/share?url=",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      let formattedValue = value;
      if (!value.startsWith("254")) {
        formattedValue = "254" + value.replace(/^0+/, "");
      }
      // Limit to 12 digits
      formattedValue = formattedValue.slice(0, 12);
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bidAmount.trim())
      newErrors.bidAmount = "bidAmount is required";
    if (formData.bidAmount.trim() === "0")
      newErrors.bidAmount = "0 is not allowed";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!/^254\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in the format 254xxxxxxxxx";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/bids/public/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bidAmount: formData.bidAmount,
          phoneNumber: formData.phoneNumber,
          productCode: product.productCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.data);
        setFormData({ bidAmount: "", phoneNumber: "" });
      } else {
        toast.error(data.message || "Failed to place bid");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const { timeLeft, isClient, formatTime } = useTimer(product?.expiryDate);

  if (!product) {
    return null;
  }

  if (error) {
    return (
      <div className={styles.cardNotFound}>
        <NotFoundIcon height={30} width={30} className={styles.notFoundImg} />
        <h1>Product not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.innnerCard}>
        <div className={styles.cardImageWrapper}>
          <div className={styles.cardImageTop}>
            <span>{product.productCode}</span>
            <CloseIcon
              className={styles.closeIcon}
              onClick={closeCard}
              alt="close icon"
              width={24}
              height={24}
            />
          </div>
          <div className={styles.productImageSlider}>
            {product.images && product.images[currentImageIndex] && (
              <Image
                className={styles.cardImage}
                src={product.images[currentImageIndex].fileLink}
                alt={product.productName}
                width={200}
                height={200}
                priority={true}
              />
            )}
            <div className={styles.imageSlider}>
              {product.images?.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.circleAdv} ${
                    currentImageIndex === index ? styles.activeCircle : ""
                  }`}
                  onClick={() => handleCircleClick(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className={styles.cardImageInfo}>
            <h2>{product.productName}</h2>
            <p>{product.description}</p>
          </div>
        </div>
        <div className={styles.cardGlass}>
          <div className={styles.cardGlassInfo}>
            <h3>Bid Ending in: </h3>
            <span>{isClient ? formatTime(timeLeft) : "20 H :00 M: 00 S"}</span>
          </div>
          <hr className={styles.cardHr} />
          <div className={styles.cardGlassInfo}>
            <h3>Market Price: </h3> <span>{product.marketPrice}</span>
          </div>
        </div>
        <div className={styles.cardBottom}>
          {product.featureList?.map((feature, index) => (
            <div className={styles.cardBottomInfo} key={index}>
              <h3>{feature.featureProperty} </h3>{" "}
              <span>{feature.featureValue}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className={styles.footerForm}>
        <div className={styles.formInput}>
          <BidIcon
            className={styles.formIcon}
            alt="bidAmount icon"
            width={20}
            height={20}
          />

          <input
            type="text"
            name="bidAmount"
            value={formData.bidAmount}
            onChange={handleInputChange}
            placeholder="Your bid price"
          />
          {errors.bidAmount && (
            <span className={styles.error}>{errors.bidAmount}</span>
          )}
        </div>
        <div className={styles.formInput}>
          <PhoneIcon
            className={styles.formIcon}
            alt="phone icon"
            width={20}
            height={20}
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="254xxxxxxxxx"
          />
          {errors.phoneNumber && (
            <span className={styles.error}>{errors.phoneNumber}</span>
          )}
        </div>
        <div className={styles.authBottomBtn}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formBidButton}
          >
            {isLoading ? <Loader /> : "Bid"}
          </button>
        </div>
        <div className={styles.formPromoteBtn} onClick={handlePromote}>
          Promote
        </div>
      </form>
      <PopUp
        isOpen={isOpen}
        onClose={toggleIsOpen}
        content={
          <div className={styles.popupContent}>
            <div className={styles.popupContentInner}>
              <div className={styles.popupHeader}>
                <h1>Social share</h1>
                <p>Share this link via</p>
              </div>
              <div className={styles.socialContainer}>
                {socialData.map((data, index) => (
                  <div
                    className={styles.socialIconWrap}
                    key={index}
                    onClick={() => openSocialLink(data.link)}
                  >
                    <Image
                      className={styles.socialIcon}
                      src={data.icons}
                      alt={data.name}
                      height={20}
                      priority={true}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.copyInner}>
              <h1>Copy link</h1>
              <div className={styles.copyField}>
                <LinkIcon
                  className={styles.linkIcon}
                  alt="link icon"
                  width={24}
                  height={24}
                />
                <span>{shareLink}</span>
              </div>
              <button className={styles.formPromoteBtn} onClick={copyLink}>
                {isCopied ? (
                  "Copied!"
                ) : (
                  <ShareIcon
                    className={styles.shareIcon}
                    alt="share icon"
                    width={24}
                    height={24}
                  />
                )}
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}
