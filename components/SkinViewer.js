import { useEffect, useRef, useState } from "react";
import styles from "./SkinViewer.module.css";
import { art, levelOf, tierFor } from "../lib/collection";

// Falls back to the base art once if a skin image is missing.
const fallbackToBase = (championId, loader) => (e) => {
  if (e.currentTarget.dataset.fallback) return;
  e.currentTarget.dataset.fallback = "1";
  e.currentTarget.src = loader(championId, 0);
};

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true" style={{ transform: `rotate(-45deg)${flip ? " scaleX(-1)" : ""}` }}>
    <path d="M8 1.5L3.5 6 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export default function SkinViewer({ champion, version, onClose }) {
  const skins = champion.skins ?? [];
  const tier = tierFor(levelOf(champion));
  const [index, setIndex] = useState(0);
  const [detail, setDetail] = useState({ title: null, parents: {} });
  const closeRef = useRef(null);
  const stripRef = useRef(null);

  // Champion title and chroma -> parent skin map from Data Dragon.
  useEffect(() => {
    let cancelled = false;
    fetch(art.detail(version, champion.id))
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const info = data.data[champion.id];
        const parents = {};
        info.skins.forEach((s) => {
          if (s.parentSkin != null) parents[s.num] = s.parentSkin;
        });
        setDetail({ title: info.title, parents });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [champion.id, version]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (!skins.length) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % skins.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + skins.length) % skins.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose, skins.length]);

  useEffect(() => {
    stripRef.current?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  const resolve = (num) => detail.parents[num] ?? num;
  const current = skins[index];
  const splashNum = current ? resolve(current.num) : 0;
  const step = (delta) => setIndex((i) => (i + delta + skins.length) % skins.length);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${champion.name} skins`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.viewer} style={{ "--c": `var(--tier-${tier.key})` }}>
        <img
          key={splashNum}
          className={styles.splash}
          src={art.splash(champion.id, splashNum)}
          onError={fallbackToBase(champion.id, art.splash)}
          alt={current?.name ?? champion.name}
        />
        <div className={styles.shade} />

        <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>

        <div className={styles.caption}>
          <p className={styles.eyebrow}>
            {tier.label} · Level {levelOf(champion)}
          </p>
          <h2 className={styles.champName}>{champion.name}</h2>
          {detail.title && <p className={styles.champTitle}>{detail.title}</p>}
          <div className={styles.divider}>
            <span />
          </div>
          <p className={styles.skinName}>{current ? current.name : "No skins unlocked yet"}</p>
          {skins.length > 0 && (
            <p className={styles.counter}>
              Skin {index + 1} of {skins.length}
            </p>
          )}
        </div>

        {skins.length > 0 && (
          <div className={styles.dock}>
            {skins.length > 1 && (
              <button type="button" className={styles.navBtn} onClick={() => step(-1)} aria-label="Previous skin">
                <Chevron />
              </button>
            )}
            <ul className={styles.strip} ref={stripRef}>
              {skins.map((skin, i) => (
                <li key={skin.num}>
                  <button
                    type="button"
                    className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={skin.name}
                    aria-current={i === index}
                  >
                    <img
                      key={resolve(skin.num)}
                      src={art.loading(champion.id, resolve(skin.num))}
                      onError={fallbackToBase(champion.id, art.loading)}
                      alt=""
                      loading="lazy"
                    />
                  </button>
                </li>
              ))}
            </ul>
            {skins.length > 1 && (
              <button type="button" className={styles.navBtn} onClick={() => step(1)} aria-label="Next skin">
                <Chevron flip />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
