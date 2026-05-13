import styles from './Inventory.module.css';
import { useMemo, useState } from "react";

let ddragonVersion = "16.6.1";
fetch("https://ddragon.leagueoflegends.com/api/versions.json")
  .then(r => r.json())
  .then(v => { ddragonVersion = v[0]; })
  .catch(() => {});

const Inventory = ({ user }) => {
  const sortInventory = (inventory) => {
    return inventory?.sort((a, b) => b.level - a.level);
  }
  const inventory = useMemo(() => sortInventory(user?.inventory), [user]);

  const [selectedChampionSkins, setSelectedChampionSkins] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentSkinMap, setParentSkinMap] = useState({});

  const handleChampionClick = async (champion) => {
    setSelectedChampionSkins(champion);
    setIsModalOpen(true);
    setParentSkinMap({});

    try {
      const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/champion/${champion.id}.json`);
      const data = await res.json();
      const skins = data.data[champion.id].skins;
      const map = {};
      skins.forEach(s => {
        if (s.parentSkin != null) map[s.num] = s.parentSkin;
      });
      setParentSkinMap(map);
    } catch (e) {
      // silently fail — images will just try original num
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChampionSkins(null);
  };

  const getSkinImageUrl = (championId, skinNum) => {
    const resolvedNum = parentSkinMap[skinNum] ?? skinNum;
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_${resolvedNum}.jpg`;
  };

  const getLevelEmoji = (level) => {
    if (level >= 15) return ' 🤯';
    if (level >= 10) return ' 💫';
    if (level >= 5)  return ' 🌟';
    if (level >= 3)  return ' ⭐';
    return '';
  };

  return (
    <div className={styles.inventoryContainer}>
      {inventory?.map((item, index) => (
        <div
          className={styles.itemContainer}
          key={`${item.id}-${index}`}
          onClick={() => handleChampionClick(item)}
        >
          <img
            className={styles.inventoryImg}
            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${item.id}_0.jpg`}
            alt={item.name}
          />
          <span className={styles.levelBadge}>
            Lv {item.level}{getLevelEmoji(item.level)}
          </span>
          <div className={styles.cardOverlay}>
            <p className={styles.champName}>{item.name}</p>
            <div className={styles.champMeta}>
              <span>{item.skins?.length || 0} skins</span>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && selectedChampionSkins && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedChampionSkins.name} Skins</h2>
              <span onClick={closeModal} className={styles.modalCloseIcon}>&times;</span>
            </div>
            <div className={styles.skinsGrid}>
              {selectedChampionSkins.skins && selectedChampionSkins.skins.length > 0 ? (
                selectedChampionSkins.skins.map((skin) => (
                  <div key={skin.num} className={styles.skinItem}>
                    <img
                      src={getSkinImageUrl(selectedChampionSkins.id, skin.num)}
                      alt={skin.name}
                      className={styles.skinImage}
                    />
                    <p className={styles.skinName}>{skin.name}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--color-text-muted)' }}>No skins available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
