import styles from './Home.module.css';
const medals ={
  1: '🥈',
  2: '🥉',
  0: '🏅',
}

const Home = (props) => {
  const usersList = Object.keys(props.users).sort((a, b) => {
    return props.users[b].inventory.length - props.users[a].inventory.length
  });
  const goToInventory = userName =>{
    window.location.href = `/inventory/?user=${userName}`;
  }

  return (
      <div className={styles.HomeContainer}>

        {usersList.map((value, i) => {
          return (
              <div onClick={()=> goToInventory(value)} className={styles.itemContainer} key={value}>
                <h3>{props.users[value].username} {medals[i]}</h3>
                <div className={styles.ImgContainer}>
                  <img height={50} src={props.users[value].avatarUrl}
                       alt="" />
                </div>
                <p>{props.users[value].inventory.length} Champions
                </p>
              </div>
          );
        })}
      </div>
  );
};

export default Home;