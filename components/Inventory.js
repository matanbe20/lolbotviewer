import styles from './Inventory.module.css';
import { useMemo } from "react";

const Inventory = ({ user }) => {
  const sortInventory = (inventory) => {
    return inventory?.sort((a, b) => b.level - a.level);
  }
  const inventory = useMemo(() => sortInventory(user?.inventory), [user]);
  return (
    <div className={styles.inventoryContainer}>
      {
        inventory?.map((item, index) => {
          return (
            <div className={styles.itemContainer} key={`${item.id}-${index}`}>
              <div>
                <h3 className={styles.itemDesc}>{item.name}</h3>
                <img
                  className={styles.inventoryImg}
                  src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${item.id}_0.jpg`}
                  alt="Problem"/>
                <p className={styles.itemDesc}><strong>{item.level} {item.level >= 5 && '🌟' || item.level >= 3 && '⭐'}</strong></p>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default Inventory;
