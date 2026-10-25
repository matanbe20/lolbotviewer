import styles from "./Progress.module.css";
import { percent } from "../lib/collection";

export default function Progress({ value, max, className = "" }) {
  const pct = percent(value, max);
  return (
    <div className={`${styles.progress} ${className}`} title={`${value} of ${max} champions`}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.label}>{pct}%</span>
    </div>
  );
}
