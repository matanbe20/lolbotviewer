import styles from './Home.module.css';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useMemo } from 'react';

const medals = {
  0: '🏅', 1: '🥈', 2: '🥉',
}

const Home = (props) => {
  const isSmall = useMediaQuery('(max-width: 768px)');
  const sorted = Object.keys(props.users).sort((a, b) => {
    return props.users[b].inventory.length - props.users[a].inventory.length
  });
  const goToInventory = userName => {
    window.location.href = `/inventory/?user=${userName}`;
  }

  const usersList = useMemo(() => {
    return !isSmall ? sorted.slice(3) : sorted;
  }, [isSmall]);

  return <>
    {!isSmall ? <div className={styles.top3}>
      {sorted.slice(0, 3).map((value, i) => {
        return <div key={i} onClick={() => goToInventory(value)}>
          <div style={{ textAlign: 'center', marginBottom: 5 }}>{medals[i]}</div>
          <div className={styles.topRank}>
            <img style={{ borderRadius: '50%' }} height={50} src={props.users[value].avatarUrl}
                 alt=""/>
            <span>{props.users[value].username}</span>
            <p>{props.users[value].inventory.length} Champions
            </p>
          </div>
        </div>
      })}
    </div> : null}
    <div className={styles.leaderboard}>
      {usersList.map((value, i) => {
        return <div onClick={() => goToInventory(value)}
                    className={styles.leaderboardRow}
                    key={'leaderboard-' + i}
                    style={{
                      backgroundColor: i % 2 === 0 ? '' : '#acacac0f',
                      width: isSmall ? '100%' : 500
                    }}>
          <img style={{ borderRadius: '50%' }} height={50} src={props.users[value].avatarUrl}
               alt=""/>
          <span>{props.users[value].username ?? 'Unknown'}</span>
          <span>{props.users[value].inventory.length} champions</span>
        </div>
      })}
    </div>
  </>
};

export default Home;