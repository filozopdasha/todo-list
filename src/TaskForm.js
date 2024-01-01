import React from 'react';
import {useState} from 'react';




export default function TaskForm({onAdd}) {
    const [taskName,setTaskName] = useState('');
    function handleSubmit(ev){
        ev.preventDefault();
        onAdd(taskName);
    }
    return (
            <form onSubmit={handleSubmit} >
                <button className="add-button">+</button>
                <input className="input-field" type="text"
                       value ={taskName}
                       onChange={ev => setTaskName(ev.target.value)}
                       placeholder ="Your next task"/>
            </form>
    )
}