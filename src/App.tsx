import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import ListaTaskova from "./components/ListaTaskova/ListaTaskova";
import styles from './Styles/App.module.scss'
import AddTask from "./Pages/AddTask/AddTask";
import EditTask from "./Pages/EditTask/EditTask";

function App() {
    // @ts-ignore
    return (
        <Router>
            <div className={styles.app} >
                <Navbar />
                <div className={styles.content}>
                    <Sidebar></Sidebar>
                    <main>
                        <Routes>
                            <Route path="/" element={<ListaTaskova/>}/> {/*U ranijim verzijama je bio potreban exact path, od react router v6 ne treba vise}*/}
                            <Route path="/addTask" element = {<AddTask/>}/>
                            <Route path="/edit/:id" element = {<EditTask/>}></Route>
                        </Routes>
                    </main>
                </div>
                <Footer/>
            </div>
        </Router>
    );
}

export default App
