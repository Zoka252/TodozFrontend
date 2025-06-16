// src/components/DetaljiTask/DetaljiTask.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../AddTask/AddTask.module.scss";

const DetaljiTask = () => {
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

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [naslov, setNaslov] = useState('');
    const [opis, setOpis] = useState('');
    const [deskripcija, setDeskripcija] = useState('');
    const [rok, setRok] = useState('');

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

        fetch(`http://localhost:3001/taskovi/${id}`, { signal: abortCont.signal })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Neuspešno dobavljanje taska, status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Task | Task[]) => {
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
                if (err.name !== 'AbortError') {
                    setIsPending(false);
                    setError(err.message);
                }
            });

        return () => abortCont.abort();
    }, [id]);




    const handleDelete = () => {
        if (!id) return;

        fetch(`http://localhost:3001/taskovi/${id}`, { method: 'DELETE' })
            .then(() => {
                navigate('/'); // Vrati korisnika na početnu listu
            })
            .catch((err) => {
                console.error("Greška prilikom brisanja:", err);
            });
    };

    const handleEdit = () => {
        if (id) {
            navigate(`/edit/${id}`);
        }
    };

    return (
        <div className={styles.detalji}>
            <div className={styles.addTask}>
                <form>
                    <label>Naslov</label><br />
                    <input type="text" value={naslov} disabled /><br />

                    <label>Opis</label><br />
                    <input type="text" value={opis} disabled /><br />

                    <label>Deskripcija</label><br />
                    <textarea value={deskripcija} disabled></textarea><br />

                    <label>Rok</label><br />
                    <input type="datetime-local" value={rok} disabled /><br />

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                    {isPending && <p>Učitavanje...</p>}



                    {/* Dugmad za brisanje i uređivanje */}
                    {!isPending && !error && (
                        <div  className={styles.dugmad} style={{ marginTop: "1rem" }}>
                            <button  onClick={handleDelete} style={{ marginRight: "1rem" }}>
                                Obriši
                            </button>
                            <button  onClick={handleEdit}>
                                Uredi
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default DetaljiTask;
