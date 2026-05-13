import Link from "next/link";
import styles from "./Home.module.css";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useMemo, useEffect, useRef } from "react";

const ranks = {
  0: { label: "#1", color: "51, 80%, 60%",  accentColor: "#C8AA6E" },
  1: { label: "#2", color: "210, 20%, 71%", accentColor: "#A0B4C8" },
  2: { label: "#3", color: "25, 57%, 51%",  accentColor: "#CD7F32" },
};

const Home = (props) => {
  if (typeof window === undefined) {
    return null;
  }

  const isSmall = useMediaQuery("(max-width: 768px)");
  const totalPulled = (user) =>
    user.inventory.reduce((sum, c) => sum + (c.level || 1), 0);

  const sorted = Object.keys(props.users).sort((a, b) => {
    const countDiff = props.users[b].inventory.length - props.users[a].inventory.length;
    return countDiff !== 0 ? countDiff : totalPulled(props.users[b]) - totalPulled(props.users[a]);
  });

  const usersList = useMemo(() => {
    return !isSmall ? sorted.slice(3) : sorted;
  }, [isSmall]);

  const rank1Ref = useRef(null);

  useEffect(() => {
    if (isSmall) return;
    let animationId;
    const end = Date.now() + 3000;

    import("canvas-confetti").then(({ default: confetti }) => {
      const fire = () => {
        const el = rank1Ref.current;
        const origin = el
          ? {
              x: (el.getBoundingClientRect().left + el.getBoundingClientRect().width / 2) / window.innerWidth,
              y: el.getBoundingClientRect().top / window.innerHeight,
            }
          : { x: 0.5, y: 0.3 };

        confetti({ particleCount: 6, angle: 60,  spread: 70, origin, colors: ["#C8AA6E", "#F0E6D3", "#0BC4E3", "#ffffff", "#CD7F32"] });
        confetti({ particleCount: 6, angle: 120, spread: 70, origin, colors: ["#C8AA6E", "#F0E6D3", "#0BC4E3", "#ffffff", "#CD7F32"] });

        if (Date.now() < end) {
          animationId = requestAnimationFrame(fire);
        }
      };
      fire();
    });

    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>LoLBot Leaderboard</h1>
        <p className={styles.heroSubtitle}>Season standings · champions collected</p>
      </div>

      {!isSmall ? (
        <div className={styles.top3}>
          {sorted.slice(0, 3).map((value, i) => (
            <div
              key={value}
              className={`${styles.topRank} ${styles[`rank${i + 1}`]}`}
            >
              <Link
                href={`/inventory/?user=${value}`}
                legacyBehavior
              >
                <a>
                  <div
                    className={`${styles.avatarWrapper} avatarWrapper`}
                    ref={i === 0 ? rank1Ref : null}
                  >
                    <img
                      src={props.users[value].avatarUrl ?? ""}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                    <span className={styles.rankBadge}>{ranks[i].label}</span>
                  </div>
                  <div className={styles.podiumInfo}>
                    <span className={styles.podiumName}>
                      {props.users[value].username}
                    </span>
                    <span className={styles.podiumChamps}>
                      {props.users[value].inventory.length} champions
                    </span>
                  </div>
                  <style jsx>{`
                    a:hover .avatarWrapper {
                      box-shadow: hsl(${ranks[i].color}) 0px 0px 70px 20px;
                    }
                  `}</style>
                </a>
              </Link>
              <div className={styles.podium}>{ranks[i].label}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.leaderboard}>
        {usersList.map((value, i) => {
          const rankNum = !isSmall ? i + 4 : i + 1;
          const accentColor = isSmall && i < 3 ? ranks[i].accentColor : "transparent";
          return (
            <div
              className={styles.leaderboardRow}
              key={value}
              style={{ borderLeftColor: accentColor }}
            >
              <Link href={`/inventory/?user=${value}`} as={`/inventory/${value}`}>
                <span className={styles.rowRank}>#{rankNum}</span>
                <img
                  src={props.users[value].avatarUrl}
                  alt="Avatar"
                  className={styles.listAvatar}
                />
                <span className={styles.rowUsername}>
                  {props.users[value].username ?? "Unknown"}
                </span>
                <div className={styles.rowStats}>
                  <span className={styles.rowChampCount}>
                    {props.users[value].inventory.length} champions
                  </span>
                  <span className={styles.rowTotalPulls}>
                    {totalPulled(props.users[value])} total pulls
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <footer className={styles.pageFooter}>
        <span>#LoLBot</span> · Leaderboard
      </footer>
    </>
  );
};

export default Home;
