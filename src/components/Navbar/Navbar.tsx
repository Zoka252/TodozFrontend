import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';

const Navbar = () => {
    return (

        <div className={styles.navbar}>
            <h2>To-Do App</h2>
            <div className={styles.links}>
                <Link to="/">Home</Link>
                <Link to="/addTask">Novi Task +</Link>
            </div>
        </div>
    );
};

export default Navbar;