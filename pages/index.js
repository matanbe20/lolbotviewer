import styles from "../styles/Home.module.css";
import Home from "../components/Home";

export default function Index(props) {
  return (
    <div className={styles.container}>
      <Home users={props.users} />
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const baseUrl =
    process.env.node_env === "production"
      ? "https://lolbotviewer.vercel.app"
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/getAll`);
  const result = await res.json();
  return {
   props: {
      users: result,
    },
  };
};