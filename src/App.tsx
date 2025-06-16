import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import ListaTaskova from './components/ListaTaskova/ListaTaskova';
import styles from './Styles/App.module.scss';
import AddTask from './Pages/AddTask/AddTask';
import EditTask from './Pages/EditTask/EditTask';
import Login from './Pages/Login/Login';
import DetaljiTask from "./Pages/Detalji/Detalji";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));

    useEffect(() => {
        // Opcionalno prati promene localStorage iz drugih tabova/sesija
        const onStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('userId'));
        };
        window.addEventListener('storage', onStorageChange);

        return () => {
            window.removeEventListener('storage', onStorageChange);
        };
    }, []);

    const handleLoginSuccess = (userId: string, username: string) => {
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className={styles.app}>
                {isLoggedIn && <Navbar onLogout={handleLogout} />}
                <div className={styles.content}>
                    <main>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    isLoggedIn ? (
                                        <Navigate to="/" />
                                    ) : (
                                        <Login onLoginSuccess={handleLoginSuccess} />
                                    )
                                }
                            />
                            <Route
                                path="/"
                                element={
                                    isLoggedIn ? (
                                        <ListaTaskova />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/addTask"
                                element={
                                    isLoggedIn ? (
                                        <AddTask />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/edit/:id"
                                element={
                                    isLoggedIn ? (
                                        <EditTask />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route path="/detalji/:id" element={<DetaljiTask />} />
                        </Routes>
                    </main>
                </div>
                {isLoggedIn && <Footer />}
            </div>
        </Router>
    );
}



export default App;
