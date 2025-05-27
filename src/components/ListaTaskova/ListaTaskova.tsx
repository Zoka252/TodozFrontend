import styles from './ListaTaskova.module.scss'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function ListaTaskova() {
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
        const abortCont = new AbortController();

        fetch('http://localhost:3001/taskovi',{signal: abortCont.signal})
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
                if (err.name == 'AbortError'){
                    console.log('fetch aborted');
                }else {
                    setIsPending(false);
                    setError(err.message)
                };
            });
        return () => abortCont.abort();
    }, []);

    const handleClick = (id:number) => {
        fetch('http://localhost:3001/taskovi/' + id ,{method: 'DELETE'})
            .then(() =>{
                setTaskova(prev => prev.filter((task) => task.id !== id));
            })
            .catch((err) => {
                console.log(err);
            })
    }

const handleEdit = (id:number) => {
    navigate(`/edit/${id}`);
}

    return (
        <div className={styles.naslov}>
            <div className={styles.search}>
                <h1>Lista</h1>
                <form action="">
                    <form action="/action_page.php">
                        <input type="text" placeholder="Search.." name="search"/>
                        <button type="submit"><i className="fa fa-search"></i></button>
                    </form>
                </form>
                <div className={styles.dropout}>
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                </div>
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