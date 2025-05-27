import styles from './ListaTaskova.module.scss'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


function ListaTaskova() {

    const [selectedOption, setSelectedOptions] = useState<string>('')

    const [inputValue, setInputValue] = useState('');



    type Task = {
        id: number;
        naslov: string;
        izvrsenje: number;
        korisnikov_id: number;
        napravljeno: string;
        kraj: string;
        tip_id: number;
        opis: string | null;
    }
    const [taskovi, setTaskova] = useState<Task[]>([]);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // Ovo je use efect koji fetchuje podatke, abortCont je promenljiva koja cuva
    // abort controler koji sluzi da prekine fec u slucaju promene stranice

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            // Ako nema userId, možda preusmeri na login ili samo prekini fetch
            return;
        }

        const fetchTaskovi = async () => {
            try {
                const res = await fetch(`http://localhost:3001/taskovi?userId=${userId}`);
                if (!res.ok) throw new Error('Greška pri dohvatanju taskova');
                const data = await res.json();

                // Proveravamo da li je data niz, da ne bi bilo taskovi.map greške
                setTaskova(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Greška:', err);
                setTaskova([]);
            }
        };

        fetchTaskovi();
    }, []);



    const handleClick = (id: number) => {
        fetch('http://localhost:3001/taskovi/' + id, {method: 'DELETE'})
            .then(() => {
                setTaskova(prev => prev.filter((task) => task.id !== id));
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleEdit = (id: number) => {
        navigate(`/edit/${id}`);
    }
    const options = [
        'one', 'two', 'three'
    ];

    const handleChange = (e:any) => {
        setInputValue(e.target.value);
        console.log(e.target.value);
    };

    const handleSearch = (e:any) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            // možeš dodati neki error ili redirect
            console.error("Nema userId u localStorage");
            return;
        }

        fetch(`http://localhost:3001/search?term=${inputValue}&userId=${userId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch taskovi');
                }
                return res.json();
            })
            .then((data: Task[]) => {
                console.log(data);
                setTaskova(data);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    console.log('fetch aborted');
                } else {
                    setIsPending(false);
                    setError(err.message)
                }
            });
    }


    const handleSortChange = (e:any) => {
        setSelectedOptions(e.target.value);

    };



    return (
        <div className={styles.naslov}>
            <div className={styles.search}>
                <h1>Lista</h1>
                <div className={styles.searchbar}>
                    <form onSubmit={handleSearch}>
                        <input type="text" placeholder="Search.."  onChange={handleChange} value={inputValue} />
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                            </svg>
                        </button>
                    </form>
                </div>
                <div></div>
                {/*<select value={selectedOption} onChange={handleSortChange}>*/}
                {/*    <option value="krajAsc">Vremeski:Najblizi</option>*/}
                {/*    <option value="krajDesc">Vremeski:Najdalji</option>*/}
                {/*    <option value="naslovAsc">Azbucno</option>*/}
                {/*</select>*/}

            </div>
            <div className={styles.container}>
                {taskovi.length === 0 ? (<p>Nema taskova</p>) : (
                    taskovi.map((task => (
                            <div key={task.id} className={styles.kartica}>
                                <div className="{styles.naslov}"><h2>{task.naslov}</h2></div>
                                <div className="{styles.sredina}"><h3>Opis: {task.opis ?? "Nema opisa"}</h3></div>
                                <div className={styles.dole}>
                                    <p>Rok: {new Date(task.kraj).toLocaleDateString()}</p>
                                    <button onClick={() => handleClick((task.id))}>Obrisi</button>
                                    <button onClick={() => handleEdit((task.id))}>Uredi</button>

                                </div>
                            </div>
                        ))
                    ))}
            </div>
        </div>
    )


}

export default ListaTaskova;