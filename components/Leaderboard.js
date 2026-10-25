import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Leaderboard.module.css";
import Avatar from "./Avatar";
import Progress from "./Progress";
import { art } from "../lib/collection";

const PLACES = {
  1: { tier: "Challenger" },
  2: { tier: "Grandmaster" },
  3: { tier: "Master" },
};

const Crest = ({ rank }) => (
  <svg viewBox="0 0 64 72" className={styles.crest} aria-hidden="true">
    <path d="M32 2 L61 18 L61 54 L32 70 L3 54 L3 18 Z" className={styles.crestOuter} />
    <path d="M32 9 L55 22 L55 50 L32 63 L9 50 L9 22 Z" className={styles.crestInner} />
    <text x="32" y="45" textAnchor="middle" className={styles.crestText}>
      {rank}
    </text>
  </svg>
);

const PodiumCard = ({ player, championCount, crestRef }) => {
  const main = player.top[0];
  return (
    <Link href={`/inventory/${player.id}`} className={`${styles.card} ${styles[`place${player.rank}`]}`}>
      <div className={styles.cardArt}>{main && <img src={art.loading(main.id)} alt="" />}</div>
      <div className={styles.cardShade} />
      <div className={styles.cardTop} ref={crestRef}>
        <Crest rank={player.rank} />
        <span className={styles.cardTier}>{PLACES[player.rank].tier}</span>
      </div>
      <div className={styles.cardBody}>
        <Avatar src={player.avatarUrl} name={player.username} className={styles.cardAvatar} />
        <h2 className={styles.cardName}>{player.username}</h2>
        {main && <p className={styles.cardMain}>Main · {main.name}</p>}
        <dl className={styles.cardStats}>
          <div>
            <dt>Champions</dt>
            <dd>{player.champions}</dd>
          </div>
          <div>
            <dt>Pulls</dt>
            <dd>{player.pulls}</dd>
          </div>
          <div>
            <dt>Skins</dt>
            <dd>{player.skins}</dd>
          </div>
        </dl>
        <Progress value={player.champions} max={championCount} className={styles.cardProgress} />
      </div>
    </Link>
  );
};

const useChampionConfetti = (ref, enabled) => {
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame;
    let cancelled = false;
    const end = Date.now() + 2500;
    const colors = ["#F0E6D2", "#C8AA6E", "#C89B3C", "#0AC8B9", "#CDFAFA"];

    import("canvas-confetti").then(({ default: confetti }) => {
      const fire = () => {
        if (cancelled) return;
        const rect = ref.current?.getBoundingClientRect();
        const origin = rect
          ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + 30) / window.innerHeight }
          : { x: 0.5, y: 0.35 };
        confetti({ particleCount: 3, angle: 60, spread: 55, startVelocity: 38, origin, colors, scalar: 0.9 });
        confetti({ particleCount: 3, angle: 120, spread: 55, startVelocity: 38, origin, colors, scalar: 0.9 });
        if (Date.now() < end) frame = requestAnimationFrame(fire);
      };
      fire();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [ref, enabled]);
};

export default function Leaderboard({ players, totals, meta }) {
  const crestRef = useRef(null);
  const podium = players.slice(0, 3);
  const rest = players.slice(3);

  useChampionConfetti(crestRef, players.length > 0);

  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Season standings</p>
        <h1 className={styles.title}>Leaderboard</h1>
        <div className={styles.divider}>
          <span />
        </div>
        <p className={styles.subtitle}>Every pull, every champion, every skin. Ranked.</p>

        <dl className={styles.statStrip}>
          <div className={styles.stat}>
            <dt>Summoners</dt>
            <dd>{totals.summoners}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Champions found</dt>
            <dd>
              {totals.discovered}
              <small>/{meta.championCount}</small>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>Total pulls</dt>
            <dd>{totals.pulls.toLocaleString()}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Skins owned</dt>
            <dd>{totals.skins.toLocaleString()}</dd>
          </div>
        </dl>
      </section>

      {players.length === 0 ? (
        <p className={styles.empty}>No summoners on the Rift yet.</p>
      ) : (
        <ol className={styles.podium}>
          {podium.map((player) => (
            <li key={player.id} className={styles[`slot${player.rank}`]}>
              <PodiumCard
                player={player}
                championCount={meta.championCount}
                crestRef={player.rank === 1 ? crestRef : null}
              />
            </li>
          ))}
        </ol>
      )}

      {rest.length > 0 && (
        <section className={styles.board} aria-label="Rankings">
          <div className={styles.boardHead} aria-hidden="true">
            <span>Rank</span>
            <span>Summoner</span>
            <span className={styles.hideMd}>Top champions</span>
            <span className={styles.num}>Champs</span>
            <span className={`${styles.num} ${styles.hideMd}`}>Pulls</span>
            <span className={`${styles.num} ${styles.hideMd}`}>Skins</span>
            <span className={styles.hideSm}>Collection</span>
          </div>
          <ol className={styles.list} start={4}>
            {rest.map((player, i) => (
              <li key={player.id} style={{ "--delay": `${Math.min(i, 12) * 45}ms` }}>
                <Link href={`/inventory/${player.id}`} className={styles.row}>
                  <span className={styles.rowRank}>{player.rank}</span>
                  <span className={styles.player}>
                    <Avatar src={player.avatarUrl} name={player.username} className={styles.rowAvatar} />
                    <span className={styles.rowName}>{player.username}</span>
                  </span>
                  <span className={`${styles.mains} ${styles.hideMd}`}>
                    {player.top.map((c, i) => (
                      <img
                        key={`${c.id}-${i}`}
                        src={art.icon(meta.version, c.id)}
                        alt={c.name}
                        title={`${c.name} · Lv ${c.level}`}
                        loading="lazy"
                      />
                    ))}
                  </span>
                  <span className={styles.num}>{player.champions}</span>
                  <span className={`${styles.num} ${styles.hideMd}`}>{player.pulls}</span>
                  <span className={`${styles.num} ${styles.hideMd}`}>{player.skins}</span>
                  <span className={styles.hideSm}>
                    <Progress value={player.champions} max={meta.championCount} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
