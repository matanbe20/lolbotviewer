import styles from './Inventory.module.scss';

const Logo = ()=> {
  const navigate = ()=> {
    window.location.href = '/'
  }

  return <span className={styles.logo} onClick={navigate}>#LoLBot_Viewer</span>

}

export default Logo;