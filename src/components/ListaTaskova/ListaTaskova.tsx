import styles from './ListaTaskova.module.scss';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ListaTaskova() {
    const [selectedOption, setSelectedOptions] = useState<string>('');
    const [inputValue, setInputValue] = useState('');
    const location = useLocation();

    type Task = {
        id: number;
        naslov: string;
        izvrsenje: number;
        korisnikov_id: number;
        napravljeno: string;
        kraj: string;
        tip_id: number;
        opis: string | null;
    };

    const [taskovi, setTaskova] = useState<Task[]>([]);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setTaskova([]);
            setIsPending(false);
            return;
        }

        const fetchTaskovi = async () => {
            try {
                const res = await fetch(`http://localhost:3001/taskovi?userId=${userId}`);
                if (!res.ok) throw new Error('Greška pri dohvatanju taskova');
                const data: Task[] = await res.json();

                const now = new Date();

                const updatedTaskovi = await Promise.all(data.map(async (task) => {
                    const deadline = new Date(task.kraj);
                    if (task.izvrsenje === 0 && now > deadline) {
                        try {
                            await fetch(`http://localhost:3001/taskovi/${task.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...task, izvrsenje: 1 }),
                            });
                        } catch (err) {
                            console.error('Greška pri automatskom ažuriranju taska:', err);
                        }
                        return { ...task, izvrsenje: 1 };
                    }
                    return task;
                }));

                setTaskova(updatedTaskovi);
                setIsPending(false);
                setError(null);
            } catch (err: any) {
                console.error('Greška:', err);
                setTaskova([]);
                setError(err.message || 'Greška pri učitavanju.');
                setIsPending(false);
            }
        };

        fetchTaskovi();
    }, [location.key]);

    const handleClick = (id: number) => {
        fetch(`http://localhost:3001/taskovi/${id}`, { method: 'DELETE' })
            .then(() => {
                setTaskova(prev => prev.filter(task => task.id !== id));
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleEdit = (id: number) => {
        navigate(`/edit/${id}`);
    };

    const handleDetalji = (id: number) => {
        navigate(`/detalji/${id}`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("Nema userId u localStorage");
            return;
        }

        setIsPending(true);

        fetch(`http://localhost:3001/search?term=${inputValue}&userId=${userId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch taskovi');
                return res.json();
            })
            .then((data: Task[]) => {
                setTaskova(data);
                setIsPending(false);
                setError(null);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log('fetch aborted');
                } else {
                    setError(err.message);
                    setIsPending(false);
                }
            });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOptions(e.target.value);
    };

    return (
        <div className={styles.naslov}>
            <div className={styles.search}>
                <h1>Lista</h1>
                <div className={styles.searchbar}>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search.."
                            onChange={handleChange}
                            value={inputValue}
                        />
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                            </svg>
                        </button>
                    </form>
                </div>
                <div></div>
            </div>

            <div className={styles.container}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {isPending && <p>Učitavanje...</p>}
                {!isPending && taskovi.length === 0 && <div className={styles.nema}><p>Nema taskova</p></div>}

                {!isPending && taskovi.map((task) => (
                    <div key={task.id} className={styles.kartica} onClick={() => handleDetalji(task.id)}>
                        <div className={styles.redNaslov}>
                            <h2>{task.naslov}</h2>
                            <span className={task.izvrsenje === 1 ? styles.uradjen : styles.nijeUradjen}>
                                {task.izvrsenje === 1 ? "Urađen" : "Nije urađen"}
                            </span>
                        </div>
                        <div className={styles.sredina}>
                            <h3>Opis: {task.opis ?? "Nema opisa"}</h3>
                        </div>
                        <div className={styles.dole}>
                            <p>Rok: {new Date(task.kraj).toLocaleDateString()}</p>
                            <button onClick={(e) => { e.stopPropagation(); handleClick(task.id); }}>Obriši</button>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(task.id); }}>Uredi</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListaTaskova;
