import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../AddTask/AddTask.module.scss";

const EditTask = () => {
    type Task = {
        id: number;
        naslov: string;
        opis: string | null;
        korisnikov_id: number;
        kraj: string;
        deskripcija: string | null;
        tip_id: number;
        izvrsenje: number;
        napravljeno: string;
    };

    const now = new Date();
    const minDate = now.toISOString().slice(0, 16);

    const [task, setTask] = useState<Task | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [naslov, setNaslov] = useState('');
    const [opis, setOpis] = useState('');
    const [deskripcija, setDeskripcija] = useState('');
    const [rok, setRok] = useState('');

    // Pomoćna funkcija za ispravan format datuma za input datetime-local
    const formatDateTimeLocal = (dateString: string) => {
        const date = new Date(dateString);
        const off = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - off * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    useEffect(() => {
        const abortCont = new AbortController();

        if (!id) {
            setError('Nije pronađen ID zadatka.');
            setIsPending(false);
            return;
        }

        console.log("Fetching task with id:", id);

        fetch(`http://localhost:3001/taskovi/${id}`, { signal: abortCont.signal })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Neuspešno dobavljanje taska, status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Task | Task[]) => {
                console.log("Task data from backend:", data);
                const taskData = Array.isArray(data) ? data[0] : data;
                if (!taskData) {
                    throw new Error('Task nije pronađen');
                }
                setTask(taskData);
                setNaslov(taskData.naslov);
                setOpis(taskData.opis || '');
                setDeskripcija(taskData.deskripcija || '');
                setRok(taskData.kraj ? formatDateTimeLocal(taskData.kraj) : '');
                setIsPending(false);
                setError(null);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log('Zahtev prekinut');
                } else {
                    setIsPending(false);
                    setError(err.message);
                }
            });

        return () => abortCont.abort();
    }, [id]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!naslov.trim() || !opis.trim() || !rok.trim()) {
            setError('Naslov, opis i rok su obavezni!');
            return;
        }

        setError(null);

        const updatedTask: Task = {
            id: task?.id || 0,
            naslov,
            opis,
            kraj: new Date(rok).toISOString(),  // backend uglavnom voli ISO
            korisnikov_id: task?.korisnikov_id || 5,
            tip_id: task?.tip_id || 2,
            izvrsenje: task?.izvrsenje || 0,
            deskripcija,
            napravljeno: task?.napravljeno || new Date().toISOString(),
        };

        setIsPending(true);

        fetch(`http://localhost:3001/taskovi/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Greška pri ažuriranju taska, status: ${res.status}`);
                }
                return res.text();
            })
            .then(() => {
                console.log('Task uspešno ažuriran');
                setIsPending(false);
                navigate(-1);  // vraća nazad
            })
            .catch(err => {
                console.error('Slanje ne radi', err);
                setIsPending(false);
                setError('Došlo je do greške pri čuvanju.');
            });
    };

    return (
        <div className="editTask">
            <div className={styles.addTask}>
                <form onSubmit={handleSubmit}>
                    <label>Naslov</label><br />
                    <input
                        type="text"
                        value={naslov}
                        onChange={(e) => setNaslov(e.target.value)}
                        required
                    /><br />
                    <label>Opis</label><br />
                    <input
                        type="text"
                        value={opis}
                        onChange={(e) => setOpis(e.target.value)}
                        required
                    /><br />
                    <label>Deskripcija</label><br />
                    <textarea
                        value={deskripcija}
                        onChange={(e) => setDeskripcija(e.target.value)}
                    ></textarea><br />
                    <label>Rok</label><br />
                    <input
                        type="datetime-local"
                        value={rok}
                        onChange={(e) => setRok(e.target.value)}
                        min={minDate}
                        required
                    /><br />
                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                    {!isPending && <button type="submit">Izmeni</button>}
                    {isPending && <button disabled>Čuvanje...</button>}
                </form>
            </div>
        </div>
    );
};

export default EditTask;
