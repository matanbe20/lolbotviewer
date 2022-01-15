import styles from './Inventory.module.scss';

const Inventory = ({ user }) => {
  return (
      <div className={styles.inventoryContainer}>
        {
          user.inventory.map((item) => {
            return (
                <div className={styles.itemContainer} key={item.id}>
                  <div>
                    <h3 className={styles.itemDesc}>{item.name}</h3>
                    <img
                        className={styles.inventoryImg}
                        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${item.id}_0.jpg`}
                        alt="Problem" />
                    <p className={styles.itemDesc}>Level: {item.level} {item.level >= 3 && '⭐'}</p>
                  </div>
                </div>
            );
          })
        }

      </div>

  );

};

export default Inventory;