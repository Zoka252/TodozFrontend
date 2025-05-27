    import React from "react";
    import Links from "react-router-dom";
    import styles from './Sidebar.module.scss'


    const Sidebar = () => {
        return (
            <div className={styles.sidebar}>
            <ul>
                <li>Taskovi</li>
                <li>Napravi nove taskove</li>
                <li>Brisi</li>
            </ul>
            </div>
        )
    }

    export default Sidebar;