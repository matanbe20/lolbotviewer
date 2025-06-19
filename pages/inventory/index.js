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
    if (item.skins && Array.isArray(item.skins)) { // Ensure skins is an array
      totalSkins += item.skins.length;
    }
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>{props.user.username ?? "Unknown"}'s inventory</title>
      </Head>
      <h2 className={styles.main_title}>
        <span className={styles.userName}> {props.user.username}</span>, you got
        a total of{" "}
        <span className={styles.number_champs}>
          {props.user.inventory.length}
        </span>{" "}
        Champions and <span className={styles.number_skins} style={{color : "#ffb62f"}}>{totalSkins}</span> Skins
      </h2>
      <h4 style={{ textAlign: "center" }}>Total levels: {totalLevels}</h4>
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
