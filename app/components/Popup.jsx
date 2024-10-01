import styles from "@/app/styles/popup.module.css";
import { XCircleIcon as ExitIcon } from "@heroicons/react/24/outline";

export default function PopupComponent({
  isOpen,
  onClose,
  content,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupHeader}>
        <div className={styles.popupExit}>
          <ExitIcon
            className={styles.popupIcon}
            alt="Exit icon"
            onClick={onClose}
            width={30}
            height={30}
          />
        </div>
      </div>
      {content}
    </div>
  );
}
