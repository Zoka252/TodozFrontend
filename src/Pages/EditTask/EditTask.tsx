import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "../AddTask/AddTask.module.scss";
import {useNavigate} from "react-router-dom";

const EditTask = () => {
    type Task = {
        id: number;
        naslov: string;
        opis: string | null;
        korisnikov_id: number;
        kraj: string;
        deskripcija: string;
        tip_id: number;
        izvrsenje: number;
        napravljeno: string;
    };


    const now = new Date();
    const minDate = now.toISOString().slice(0, 16);
    const [task, setTask] = useState<Task>();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const history = useNavigate();
    const {id} = useParams();
    console.log(id);



    const [naslov, setNaslov] = useState<string>('');
    const [opis, setOpis] = useState<string>('');
    const [deskripcija, setDeskripcija] = useState<string>('');
    const [rok, setRok] = useState<string>('');



    useEffect(() => {
        const abortCont = new AbortController();

        fetch(`http://localhost:3001/taskovi/${id}`,{signal: abortCont.signal})
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch taskovi');
                }
                return res.json();
            })
            .then((data: Task) => {
                console.log(data);
                setTask(data);
                setIsPending(false);
                setError(null);
                setTask(data);
                setNaslov(data.naslov);
                setOpis(data.opis || '');
                setDeskripcija(data.deskripcija || '');
                setRok(data.kraj ? data.kraj.slice(0, 16) : '');
            })
            .catch((err) => {
                if (err.name == 'AbortError'){
                    console.log('fetch aborted');
                }else {
                    setIsPending(false);
                    setError(err.message)
                };
            });
        return () => abortCont.abort();
    }, [id]);
    console.log("Task:", task);









    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!naslov.trim() || !opis.trim() || !rok.trim()) {
            setError('Naslov, opis i rok su obavezni!!!');
            return;
        }
        setError(null);

        const updatedTask   = {
            naslov,
            opis,
            kraj:rok,
            korisnikov_id: task?.korisnikov_id || 5,
            tip_id: task?.tip_id || 2,
            izvrsenje: task?.izvrsenje || 0,
            deskripcija,
            napravljeno: task?.napravljeno || new Date().toISOString().slice(0, 16),
        };

        setIsPending(true);

        fetch(`http://localhost:3001/taskovi/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedTask)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update task');
            }
            return res.text();
        })
            .then(() =>{
                console.log('Uspesno uradjeno');
                setIsPending(false);
                history(-1);
            })
            .catch((err) => {
                console.log('Slanje ne radi',err);
                setIsPending(false);
            })
    }


    return (
        <div className="editTask">
            <h1>Edituj task</h1>
            <div className={styles.addTask}>
                <form onSubmit={handleSubmit}>
                    <label>Naslov</label><br/>
                    <input type="text" value={naslov} onChange={(e) => setNaslov(e.target.value)}/><br/>
                    <label>Opis</label><br/>
                    <input type="text" value={opis} onChange={(e) => setOpis(e.target.value)}/><br/>
                    <label>Deskripcija</label><br/>
                    <textarea value={deskripcija} onChange={(e) => setDeskripcija(e.target.value)}></textarea><br/>
                    <label>Rok</label><br/>
                    <input type="datetime-local" value={rok} onChange={(e) => setRok(e.target.value)} min = {minDate}/><br/>
                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                    {!isPending && <button>Izmeni</button>}
                    {isPending && <button disabled>Cuvanje....</button>}

                </form>
            </div>
        </div>
    )
}

export default EditTask;