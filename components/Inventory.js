import styles from './Inventory.module.css';
import { useMemo, useState } from "react";

const Inventory = ({ user }) => {
  const sortInventory = (inventory) => {
    return inventory?.sort((a, b) => b.level - a.level);
  }
  const inventory = useMemo(() => sortInventory(user?.inventory), [user]);

  const [selectedChampionSkins, setSelectedChampionSkins] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChampionClick = (champion) => {
    setSelectedChampionSkins(champion);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.inventoryContainer}>
      {
        inventory?.map((item, index) => {
          return (
            <div className={styles.itemContainer} key={`${item.id}-${index}`} onClick={() => handleChampionClick(item)}>
              <div>
                <h3 className={styles.itemDesc}>{item.name}</h3>
                <img
                  className={styles.inventoryImg}
                  src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${item.id}_0.jpg`}
                  alt="Problem"/>
                <p className={styles.itemDesc}><strong>{item.level} {item.level >= 15 && '🤯' || item.level >= 10 && '💫' || item.level >= 5 && '🌟' || item.level >= 3 && '⭐'}</strong></p>
                <p className={styles.itemDesc} style={{fontSize: 12}}>({item.skins?.length || 0})</p>
              </div>
            </div>
          );
        })
      }
      {isModalOpen && selectedChampionSkins && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{selectedChampionSkins.name} Skins</h2>
            <span onClick={() => { setIsModalOpen(false); setSelectedChampionSkins(null); }} className={styles.modalCloseIcon}>&times;</span>
            <div className={styles.skinsGrid}>
              {selectedChampionSkins.skins && selectedChampionSkins.skins.length > 0 ? (
                selectedChampionSkins.skins.map((skin) => (
                  <div key={skin.id} className={styles.skinItem}>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${selectedChampionSkins.id}_${skin.num}.jpg`}
                      alt={skin.name}
                      className={styles.skinImage}
                    />
                    <p>{skin.name}</p>
                  </div>
                ))
              ) : (
                <p>No skins available for this champion.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
