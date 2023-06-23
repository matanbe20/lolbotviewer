import Link from "next/link";
import styles from "./Home.module.css";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useMemo } from "react";
import Image from "next/image";

const medals = {
  0: "🏅",
  1: "🥈",
  2: "🥉",
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
              className={`${styles.topRank} ${
                i === 0
                  ? styles.rank1
                  : i === 1
                  ? styles.rank2
                  : i === 2
                  ? styles.rank3
                  : ""
              }`}
            >
              <Link
                href={`/inventory/?user=${value}`}
                as={`/inventory/${value}`}
              >
                <img
                  style={{ borderRadius: "50%" }}
                  height={50}
                  src={props.users[value].avatarUrl ?? ""}
                  alt=""
                />
                <span>{props.users[value].username}</span>
                <div style={{ textAlign: "center", marginBottom: 5 }}>
                  {medals[i]}
                </div>
                <p style={{ marginTop: "auto" }}>
                  {props.users[value].inventory.length} Champions
                </p>
              </Link>
              <div className={styles.podium}>
                <div className={styles.medalWrapper}>
                  <Image
                    src={`/podium${i + 1}.png`}
                    alt={i + 1}
                    width={70}
                    height={70}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className={styles.leaderboard}>
        {usersList.map((value, i) => (
          <div
            className={styles.leaderboardRow}
            key={value}
            style={{
              backgroundColor: i % 2 === 0 ? "" : "#acacac0f",
              width: isSmall ? "100%" : 600,
            }}
          >
            <Link href={`/inventory/?user=${value}`} as={`/inventory/${value}`}>
              <img
                style={{ borderRadius: "50%" }}
                height={50}
                src={props.users[value].avatarUrl}
                alt=""
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
