import styles from "../styles/Home.module.css";
import Home from "../components/Home";

export default function Index(props) {
  return (
    <div className={styles.container}>
      <Home users={props.users} />
    </div>
  );
}

<<<<<<< HEAD
// Index.getInitialProps = async (ctx) => {
//   const baseUrl =
//     process.env.node_env === "production"
//       ? "https://lolbotviewer.vercel.app"
//       : "http://localhost:3000";
//   const res = await fetch(`${baseUrl}/api/getAll`);
//   const result = await res.json();
//   return {
//     users: result,
//   };
// };
=======
>>>>>>> 9ac2d6c413684625ed35cda371d294c25b8a5a1f
export const getServerSideProps = async (ctx) => {
  const baseUrl =
    process.env.node_env === "production"
      ? "https://lolbotviewer.vercel.app"
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/getAll`);
  const result = await res.json();
  return {
<<<<<<< HEAD
    props: {
=======
   props: {
>>>>>>> 9ac2d6c413684625ed35cda371d294c25b8a5a1f
      users: result,
    },
  };
};