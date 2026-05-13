import styles from "../../styles/Home.module.css";
import Inventory from "../../components/Inventory";
import Head from "next/head";

export default function InventoryPage(props) {
  let totalLevels = 0;
  props.user.inventory.forEach((item) => {
    totalLevels += parseInt(item.level);
  });

  let totalSkins = 0;
  props.user.inventory.forEach((item) => {
    if (item.skins && Array.isArray(item.skins)) {
      totalSkins += item.skins.length;
    }
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>{props.user.username ?? "Unknown"}&apos;s inventory</title>
      </Head>

      <div className={styles.inventoryHero}>
        {props.user.avatarUrl && (
          <img
            src={props.user.avatarUrl}
            alt={props.user.username}
            className={styles.inventoryAvatar}
          />
        )}
        <div className={styles.inventoryUserInfo}>
          <h1 className={styles.inventoryUsername}>
            {props.user.username ?? "Unknown"}
          </h1>
          <div className={styles.inventoryStatsBar}>
            <div className={styles.inventoryStat}>
              <span className={styles.inventoryStatValue}>
                {props.user.inventory.length}
              </span>
              <span className={styles.inventoryStatLabel}>Unique Champions</span>
            </div>
            <div className={styles.inventoryStat}>
              <span className={styles.inventoryStatValue}>{totalLevels}</span>
              <span className={styles.inventoryStatLabel}>Total Pulls</span>
            </div>
            <div className={styles.inventoryStat}>
              <span className={styles.inventoryStatValue}>{totalSkins}</span>
              <span className={styles.inventoryStatLabel}>Skins Owned</span>
            </div>
          </div>
        </div>
      </div>

      <Inventory user={props.user} />
    </div>
  );
}

export const getServerSideProps = async ({ query }) => {
  const baseUrl =
    process.env.node_env === "production"
      ? "https://lolbotviewer.vercel.app"
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/fetch?user=${query.user}`);
  const result = await res.json();
  return {
    props: {
      user: result,
      userName: query.user,
    },
  };
};
