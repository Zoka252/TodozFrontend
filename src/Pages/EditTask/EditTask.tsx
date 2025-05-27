import {useParams} from "react-router-dom";

const EditTask = () => {
    const {id} = useParams();
    console.log(id);

    // const izabraniTask = () =>{
    //     const { id } = useParams();
    //
    // }


    return (
        <div className="editTask">
            <h1>Edituj task</h1>
        </div>
    )
}

export default EditTask;