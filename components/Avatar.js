import { useState } from "react";
import styles from "./Avatar.module.css";

// Summoner avatar with an initial-letter fallback when the image is missing or broken.
export default function Avatar({ src, name, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className={`${styles.fallback} ${className}`} aria-hidden="true">
        {(name || "?").charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className={`${styles.avatar} ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
