import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';

const Navbar = ({ onLogout }: { onLogout: () => void }) => {
    const username = localStorage.getItem('username');

    return (
        <div className={styles.navbar}>
            <Link to="/"><h2>To-Do App</h2></Link>
            <div className={styles.username}>
                {username && (
                    <div className={styles.userActions}>
                        <span><strong>{username}</strong></span>
                        <button onClick={onLogout} className={styles.logoutBtn}>Odjavi se</button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Navbar;
