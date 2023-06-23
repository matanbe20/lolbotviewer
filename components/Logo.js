import Link from "next/link";
import styles from "./Inventory.module.css";

const Logo = () => {
  return (
    <Link href="/" className={styles.logo}>
      #LoLBot_Viewer
    </Link>
  );
};

export default Logo;
