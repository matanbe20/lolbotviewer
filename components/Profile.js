import { useCallback, useMemo, useState } from "react";
import styles from "./Profile.module.css";
import Avatar from "./Avatar";
import SkinViewer from "./SkinViewer";
import { TIERS, art, byLevel, levelOf, percent, tierFor, totalPulls, totalSkins } from "../lib/collection";

const SORTS = {
  level: { label: "Highest level", sort: byLevel },
  skins: {
    label: "Most skins",
    sort: (list) =>
      [...list].sort((a, b) => (b.skins?.length || 0) - (a.skins?.length || 0) || levelOf(b) - levelOf(a)),
  },
  name: { label: "A – Z", sort: (list) => [...list].sort((a, b) => a.name.localeCompare(b.name)) },
};

const Ring = ({ pct }) => (
  <svg viewBox="0 0 36 36" className={styles.ring} aria-hidden="true">
    <circle cx="18" cy="18" r="15.9155" className={styles.ringTrack} />
    <circle cx="18" cy="18" r="15.9155" className={styles.ringFill} strokeDasharray={`${pct} 100`} />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default function Profile({ user, rank, totalPlayers, meta }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("level");
  const [tier, setTier] = useState("all");
  const [selected, setSelected] = useState(null);
  const closeViewer = useCallback(() => setSelected(null), []);

  // The same champion can appear more than once, so key cards by their original position.
  const inventory = useMemo(
    () => user.inventory.map((c, i) => ({ ...c, uid: `${c.id}-${i}` })),
    [user.inventory]
  );
  const main = useMemo(() => byLevel(inventory)[0], [inventory]);
  const completion = percent(inventory.length, meta.championCount);

  const tierCounts = useMemo(() => {
    const counts = {};
    inventory.forEach((c) => {
      const key = tierFor(levelOf(c)).key;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [inventory]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = inventory.filter(
      (c) =>
        (tier === "all" || tierFor(levelOf(c)).key === tier) &&
        (!q || c.name.toLowerCase().includes(q))
    );
    return SORTS[sort].sort(filtered);
  }, [inventory, query, sort, tier]);

  return (
    <>
      <section className={styles.banner}>
        {main && <img className={styles.bannerArt} src={art.splash(main.id)} alt="" />}
        <div className={styles.bannerShade} />

        <div className={styles.identity}>
          <div className={styles.frame}>
            <Avatar src={user.avatarUrl} name={user.username} className={styles.frameAvatar} />
            <span className={styles.rankPlate}>#{rank}</span>
          </div>
          <div className={styles.identityText}>
            <p className={styles.eyebrow}>Summoner profile</p>
            <h1 className={styles.name}>{user.username ?? "Unknown"}</h1>
            <p className={styles.sub}>
              Ranked <strong>#{rank}</strong> of {totalPlayers}
              {main && (
                <>
                  {" "}· Main <strong>{main.name}</strong> at level {levelOf(main)}
                </>
              )}
            </p>
          </div>
        </div>

        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>Champions</dt>
            <dd>
              {inventory.length}
              <small>/{meta.championCount}</small>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>Total pulls</dt>
            <dd>{totalPulls(user)}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Skins owned</dt>
            <dd>{totalSkins(user)}</dd>
          </div>
          <div className={`${styles.stat} ${styles.statRing}`}>
            <Ring pct={completion} />
            <div>
              <dt>Collection</dt>
              <dd>{completion}%</dd>
            </div>
          </div>
        </dl>
      </section>

      <section className={styles.collection}>
        <div className={styles.toolbar}>
          <h2 className={styles.sectionTitle}>
            Collection <span className={styles.count}>{visible.length} shown</span>
          </h2>
          <div className={styles.controls}>
            <label className={styles.search}>
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search champions"
                aria-label="Search champions"
              />
            </label>
            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort champions"
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.chips} role="group" aria-label="Filter by tier">
            <button
              type="button"
              className={`${styles.chip} ${tier === "all" ? styles.chipActive : ""}`}
              onClick={() => setTier("all")}
              aria-pressed={tier === "all"}
            >
              All <span>{inventory.length}</span>
            </button>
            {TIERS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`${styles.chip} ${tier === t.key ? styles.chipActive : ""}`}
                style={{ "--c": `var(--tier-${t.key})` }}
                onClick={() => setTier(t.key)}
                aria-pressed={tier === t.key}
                disabled={!tierCounts[t.key]}
                title={t.min ? `Level ${t.min}+` : "Level 1–2"}
              >
                {t.label} <span>{tierCounts[t.key] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {visible.length ? (
          <ul className={styles.grid}>
            {visible.map((c, i) => {
              const t = tierFor(levelOf(c));
              return (
                <li key={c.uid} style={{ "--delay": `${Math.min(i, 18) * 25}ms` }}>
                  <button type="button" className={`${styles.champ} ${styles[t.key]}`} onClick={() => setSelected(c)}>
                    <img className={styles.champImg} src={art.loading(c.id)} alt="" loading="lazy" />
                    <span className={styles.champShade} />
                    <span className={styles.level} title={`Level ${levelOf(c)}`}>
                      <span>{levelOf(c)}</span>
                    </span>
                    <span className={styles.tierTag}>{t.label}</span>
                    <span className={styles.info}>
                      <span className={styles.champName}>{c.name}</span>
                      <span className={styles.champSkins}>
                        {c.skins?.length || 0} {c.skins?.length === 1 ? "skin" : "skins"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.empty}>
            {inventory.length ? "No champions match those filters." : "No champions pulled yet."}
          </p>
        )}
      </section>

      {selected && <SkinViewer champion={selected} version={meta.version} onClose={closeViewer} />}
    </>
  );
}
