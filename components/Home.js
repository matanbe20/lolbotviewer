import styles from './Home.module.scss';
const medals ={
  1: '🥈',
  2: '🥉',
  0: '🏅',
}

const Home = (props) => {
  const usersList = Object.keys(props.users).sort((a, b) => {
    console.log(a, b);
    return props.users[b].inventory.length - props.users[a].inventory.length
  });
  console.log(usersList);
  const goToInventory = userName =>{
    window.location.href = `/inventory/?user=${userName}`;
  }

  return (
      <div className={styles.HomeContainer}>

        {usersList.map((value, i) => {
          return (
              <div onClick={()=> goToInventory(value)} className={styles.itemContainer} key={value}>
                <h3>{value} {medals[i]}</h3>
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