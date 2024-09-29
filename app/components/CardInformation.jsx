import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/app/components/loader";
import { useTimer } from "@/app/hooks/timer";
import { useAuthStore } from "@/app/store/Auth";
import { useProductStore } from "@/app/store/Product";
import { useState, useEffect, useCallback } from "react";
import styles from "@/app/styles/cardInformation.module.css";
import {
  BanknotesIcon as bidAmountIcon,
  PhoneIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function CardInformation() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuth } = useAuthStore();
  const { product, setProduct } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [formData, setFormData] = useState({
    bidAmount: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const handlePromote = () => {
    if (!isAuth) {
      router.push("/authentication/login", { scroll: false });
    } else {
      router.push("dashboard", { scroll: false });
    }
  };

  const closeCard = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("id");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getProductsByID = async (id) => {
    setIsLoading(true);
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
      setProduct(data.data);
    } catch (error) {
      console.error("Error fetching product", error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      let formattedValue = value;
      if (!value.startsWith('254')) {
        formattedValue = '254' + value.replace(/^0+/, '');
      }
      // Limit to 12 digits
      formattedValue = formattedValue.slice(0, 12);
      setFormData(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bidAmount.trim()) newErrors.bidAmount = "bidAmount is required";
    if (formData.bidAmount.trim() === "0") newErrors.bidAmount = "0 is not allowed";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
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
          <bidAmountIcon
            className={styles.formIcon}
            alt="bidAmount icon"
            width={30}
            height={30}
          />
          <input
            type="text"
            name="bidAmount"
            value={formData.bidAmount}
            onChange={handleInputChange}
            placeholder="10"
          />
          {errors.bidAmount && <span className={styles.error}>{errors.bidAmount}</span>}
        </div>
        <div className={styles.formInput}>
          <PhoneIcon
            className={styles.settingIcon}
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
          {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
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
    </div>
  );
}