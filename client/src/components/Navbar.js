import React from 'react';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.companyName} onClick={()=>(navigate('/'))}>Roxiler</h1>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem} onClick={()=>(navigate('/'))} >Home</li>
        <li className={styles.navbarItem} onClick={()=>(navigate('/price_stats'))} >Price Statistics</li>
        <li className={styles.navbarItem} onClick={()=>(navigate('/category_stats'))} >Category Statistics</li>
        <li className={styles.navbarItem} onClick={()=>(navigate('/transaction_stats'))} >Sale Statistics</li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
