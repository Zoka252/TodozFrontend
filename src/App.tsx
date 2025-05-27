import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import ListaTaskova from "./components/ListaTaskova/ListaTaskova";
import styles from './Styles/App.module.scss'
import AddTask from "./Pages/AddTask/AddTask";
import EditTask from "./Pages/EditTask/EditTask";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Login from "./Pages/Login/Login";
import AuthWrapper from "./components/Verifikacija";

function App() {
    // @ts-ignore
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('vukan') && window.location.pathname !== '/login') {
            navigate('/login');
        }
    }, [navigate]);

        return (
            <Router>
                <AuthWrapper>
                    <div className={styles.app}>
                        <Navbar />
                        <div className={styles.content}>
                            <main>
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/" element={<ListaTaskova />} />
                                    <Route path="/addTask" element={<AddTask />} />
                                    <Route path="/edit/:id" element={<EditTask />} />
                                </Routes>
                            </main>
                        </div>
                        <Footer />
                    </div>
                </AuthWrapper>
            </Router>
        );
    }

export default App;
