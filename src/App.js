import React from 'react';
import './App.css';
import NewTask from './newTask';
import TaskForm from './TaskForm';
import {useEffect, useState} from 'react';


function App() {
    const[tasks, setTasks] = useState([]);
    useEffect(() => {
        if(tasks.length === 0) return;
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks]);
    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks'))
        setTasks(tasks);
    }, []);
    function addTask(name){
        setTasks(prev => {
            return [...prev, {name:name, done:false}];
        })

    }

    function updateTaskDone(taskIndex, newDone){
        setTasks(prev => {
            const newTasks = [...prev];
            newTasks[taskIndex].done = newDone;
            return newTasks;
        });
    }

    function removeTask(indexToRemove){
        setTasks(prev =>{
            return prev.filter((taskObject, index) =>
                index !== indexToRemove
            );
        })
    }
  return (
    <div className="main-container">
        <TaskForm onAdd={addTask}/>
        {tasks.map((task, index) =>(
            <NewTask{...task}
                onTrash={() => removeTask(index)}
                    onToggle ={done => updateTaskDone(index, done)}/>
        ))}
    </div>
  );
}

export default App;
