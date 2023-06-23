import styles from "../../styles/Home.module.css";
import Inventory from "../../components/Inventory";
import Head from "next/head";

export default function Home(props) {
  let totalLevels = 0;
  props.user.inventory.forEach((item) => {
    totalLevels += parseInt(item.level);
  });

  console.log(totalLevels);
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
        Champions
      </h2>
      <h4 style={{ textAlign: "center" }}>Total levels: {totalLevels}</h4>
      <Inventory user={props.user} />
    </div>
  );
}

Home.getInitialProps = async (ctx) => {
  console.log(ctx.query.user);
  const baseUrl =
    process.env.node_env === "production"
      ? "https://lolbotviewer.vercel.app"
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/fetch?user=${ctx.query.user}`);
  const result = await res.json();
  return {
    user: result,
    userName: ctx.query.user,
  };
};
