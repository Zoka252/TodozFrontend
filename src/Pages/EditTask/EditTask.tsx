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

    // Formatiranje datuma za datetime-local input
    const formatDateTimeLocal = (dateString: string) => {
        const date = new Date(dateString);
        const off = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - off * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    useEffect(() => {

        if (!id) {
            setError('Nije pronađen ID zadatka.');
            setIsPending(false);
            return;
        }

        fetch(`http://localhost:3001/taskovi/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Neuspešno dobavljanje taska, status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Task | Task[]) => {
                const taskData = Array.isArray(data) ? data[0] : data;
                if (!taskData) throw new Error('Task nije pronađen');

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
                    setError(err.message);
                    setIsPending(false);
                }
            });

    }, [id]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!naslov.trim() || !opis.trim() || !rok.trim()) {
            setError('Naslov, opis i rok su obavezni!');
            return;
        }

        setError(null);

        if (!task) {
            setError('Task nije učitan.');
            return;
        }

        const updatedTask: Task = {
            id: task.id,
            naslov,
            opis,
            kraj: new Date(rok).toISOString(),
            korisnikov_id: task.korisnikov_id,
            tip_id: task.tip_id,
            izvrsenje: task.izvrsenje,
            deskripcija,
            napravljeno: task.napravljeno,
        };

        setIsPending(true);

        fetch(`http://localhost:3001/taskovi/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        })
            .then(res => {
                if (!res.ok) throw new Error(`Greška pri ažuriranju taska, status: ${res.status}`);
                return res.text();
            })
            .then(() => {
                setIsPending(false);
                navigate(-1);
            })
            .catch(err => {
                setIsPending(false);
                setError('Došlo je do greške pri čuvanju.');
                console.error(err);
            });
    };

    const handleMarkAsDone = () => {
        if (!task || task.izvrsenje === 1) return;

        const updatedTask = { ...task, izvrsenje: 1 };

        fetch(`http://localhost:3001/taskovi/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        })
            .then(res => {
                if (!res.ok) throw new Error('Greška prilikom označavanja taska kao završenog.');
                return res.text();
            })
            .then(() => {
                setTask(prev => prev ? { ...prev, izvrsenje: 1 } : prev);
                alert('Zadatak je označen kao završen.');
            })
            .catch(err => {
                alert('Greška pri ažuriranju.');
                console.error(err);
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
                    <button
                        type="button"
                        className={styles.oznaci}
                        onClick={handleMarkAsDone}
                        disabled={task?.izvrsenje === 1}
                    >
                        {task?.izvrsenje === 1 ? 'Već označen kao završen' : 'Označi kao završen'}
                    </button>
                    <br />
                    {error && <p style={{ color: 'red', marginBottom: '1rem' , }}>{error}</p>}
                    {!isPending && <button type="submit" style={{marginTop:'10px'}}>Izmeni</button>}
                    {isPending && <button disabled>Čuvanje...</button>}
                </form>
            </div>
        </div>
    );
};

export default EditTask;
