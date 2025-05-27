import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/addTask');
    };

    return (
        <footer className={styles.footer}>
            <button className={styles.button} onClick={handleClick}>
                Novi task +
            </button>
        </footer>
    );
};

export default Footer;