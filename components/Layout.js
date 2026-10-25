import Head from "next/head";
import Link from "next/link";
import { Cinzel, Barlow } from "next/font/google";
import styles from "./Layout.module.css";
import { art } from "../lib/collection";

const display = Cinzel({ subsets: ["latin"], weight: ["600", "700", "900"], variable: "--font-display" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const Emblem = ({ className }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="emblemGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F0E6D2" />
        <stop offset="1" stopColor="#785A28" />
      </linearGradient>
      <radialGradient id="emblemCore">
        <stop offset="0" stopColor="#CDFAFA" />
        <stop offset="0.5" stopColor="#0AC8B9" />
        <stop offset="1" stopColor="#005A82" />
      </radialGradient>
    </defs>
    <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="none" stroke="url(#emblemGold)" strokeWidth="2" />
    <path d="M20 8 L32 20 L20 32 L8 20 Z" fill="#010A13" stroke="url(#emblemGold)" strokeWidth="1" />
    <path d="M20 13 L27 20 L20 27 L13 20 Z" fill="url(#emblemCore)" />
  </svg>
);

export default function Layout({ title, backdrop, active, children }) {
  return (
    <div className={`${display.variable} ${body.variable} ${styles.root}`}>
      <Head>
        <title>{`${title} · LoLBot`}</title>
      </Head>

      <div className={styles.backdrop} aria-hidden="true">
        {backdrop && <img src={art.splash(backdrop)} alt="" className={styles.backdropArt} />}
      </div>

      <header className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <Emblem className={styles.emblem} />
          <span>
            LoL<span className={styles.brandAccent}>Bot</span>
          </span>
        </Link>
        <nav className={styles.tabs}>
          <Link
            href="/"
            className={`${styles.tab} ${active === "leaderboard" ? styles.tabActive : ""}`}
          >
            Leaderboard
          </Link>
          {active === "profile" && (
            <span className={`${styles.tab} ${styles.tabActive}`}>Collection</span>
          )}
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <Emblem className={styles.footerEmblem} />
        <p>
          LoLBot isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of
          Riot Games or anyone officially involved in producing or managing Riot Games properties.
          Riot Games and all associated properties are trademarks or registered trademarks of Riot
          Games, Inc.
        </p>
      </footer>
    </div>
  );
}
