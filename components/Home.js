import Link from "next/link";
import styles from "./Home.module.css";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useMemo } from "react";

const ranks = {
  0: {
    medal: "🏅",
    color: "51, 100%, 50%",
  },
  1: {
    medal: "🥈",
    color: "0, 0%, 75%",
  },
  2: {
    medal: "🥉",
    color: "30, 61%, 50%",
  },
};

const Home = (props) => {
  if (typeof window === undefined) {
    return null;
  }

  const isSmall = useMediaQuery("(max-width: 768px)");
  const sorted = Object.keys(props.users).sort((a, b) => {
    return props.users[b].inventory.length - props.users[a].inventory.length;
  });

  const usersList = useMemo(() => {
    return !isSmall ? sorted.slice(3) : sorted;
  }, [isSmall]);

  return (
    <>
      {!isSmall ? (
        <div className={styles.top3}>
          {sorted.slice(0, 3).map((value, i) => (
            <div
              key={value}
              className={`${styles.topRank} ${styles[`rank${i + 1}`]}`}
            >
              <Link
                href={`/inventory/?user=${value}`}
                as={`/inventory/?user=${value}`}
                legacyBehavior
              >
                <a>
                  <div className={`${styles.avatarWrapper} avatarWrapper`}>
                    <img
                      src={props.users[value].avatarUrl ?? ""}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                  </div>
                  <div style={{ color: `hsl(${ranks[i].color})` }}>
                    {props.users[value].username}
                  </div>
                  <div>{props.users[value].inventory.length} Champions</div>
                  <style jsx>{`
                    a:hover .avatarWrapper {
                      width: 50px;
                      box-shadow: hsl(${ranks[i].color}, 0.6) 0px 0px 70px 20px;
                    }
                  `}</style>
                </a>
              </Link>
              <div className={styles.podium}>{ranks[i].medal}</div>
            </div>
          ))}
        </div>
      ) : null}
      <div className={styles.leaderboard}>
        {usersList.map((value) => (
          <div
            className={styles.leaderboardRow}
            key={value}
            style={{
              width: isSmall ? "100%" : 600,
            }}
          >
            <Link href={`/inventory/?user=${value}`} as={`/inventory/${value}`}>
              <img
                src={props.users[value].avatarUrl}
                alt="Avatar"
                className={styles.avatar}
              />
              <span>{props.users[value].username ?? "Unknown"}</span>
              <span className={styles.champions}>
                {props.users[value].inventory.length} champions
              </span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
