import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import Inventory from '../../components/Inventory';

export default function Home(props) {
  return (
      <div className={styles.container}>
        <h2 className={styles.main_title}>Hey <span className={styles.userName}> {props.userName}</span>, here is your Inventory: </h2>
        <Inventory user={props.user}/>
      </div>
  );
}

Home.getInitialProps = async (ctx) => {
  console.log(ctx.query.user);
  const baseUrl = process.env.node_env === 'production' ? 'https://lolbotviewer.vercel.app' : 'http://localhost:3000';
  const res = await fetch(
      `${baseUrl}/api/fetch?user=${ctx.query.user}`);
  const result = await res.json();
  return {
    user: result,
    userName: ctx.query.user,
  };
};
