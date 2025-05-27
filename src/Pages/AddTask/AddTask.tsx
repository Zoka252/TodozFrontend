import styles from './AddTask.module.scss'
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const AddTask = () => {
    const [naslov, setNaslov] = useState('');
    const [opis, setOpis] = useState('');
    const [deskripcija, setDeskripcija] = useState('');
    const [rok, setRok] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');
    const now = new Date();
    const minDate = now.toISOString().slice(0, 16);
    const history = useNavigate();

    // Uzmi korisnikov ID iz localStorage
    const korisnikId = localStorage.getItem('userId');

    if (!korisnikId) {
        return <p>Niste prijavljeni.</p>;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!naslov.trim() || !opis.trim() || !rok.trim()) {
            setError('Naslov, opis i rok su obavezni!!!');
            return;
        }

        setError('');

        const task = {
            naslov,
            opis,
            kraj: rok,
            korisnikov_id: parseInt(korisnikId),
            tip_id: 2,
            izvrsenje: 0,
            deskripcija,
            napravljeno: new Date().toISOString().slice(0, 16),
        };

        setIsPending(true);

        fetch('http://localhost:3001/taskovi', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(task)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Zahtev nije uspeo');
                }
                return res.text();
            })
            .then(() => {
                setIsPending(false);
                setNaslov('');
                setOpis('');
                setDeskripcija('');
                setRok('');
                history(-1);
            })
            .catch((err) => {
                console.error('Slanje taska ne radi', err);
                setIsPending(false);
            });
    };

    return (
        <div className={styles.addTask}>
            <form onSubmit={handleSubmit}>
                <label>Naslov</label><br/>
                <input type="text" value={naslov} onChange={(e) => setNaslov(e.target.value)} /><br/>
                <label>Opis</label><br/>
                <input type="text" value={opis} onChange={(e) => setOpis(e.target.value)} /><br/>
                <label>Deskripcija</label><br/>
                <textarea value={deskripcija} onChange={(e) => setDeskripcija(e.target.value)}></textarea><br/>
                <label>Rok</label><br/>
                <input type="datetime-local" value={rok} onChange={(e) => setRok(e.target.value)} min={minDate} /><br/>
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                {!isPending && <button>Napravi</button>}
                {isPending && <button disabled>Napravljen!</button>}
            </form>
        </div>
    );
};

export default AddTask;
