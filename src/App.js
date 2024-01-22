import React, { useEffect, useState } from 'react';
import {BrowserRouter, useLocation, Routes, Route, Link} from 'react-router-dom';
import Login from './registration-pages/Login';
import Signup from './registration-pages/Signup';
import NewTask from './todo/NewTask';
import TaskForm from './todo/TaskForm';
import './App.css';
import Calendar from "./calendar/Calendar";
import EmailPage from "./registration-pages/EmailPage"
import PasswordPage from "./registration-pages/PasswordPage"


function UseLocationComponent() {
    const location = useLocation();

    useEffect(() => {
        const currentRoute = location.pathname;
        const pathSegments = currentRoute.split('/');
        const filteredSegments = pathSegments.slice(0, -1);
        const filteredRoute = filteredSegments.join('/');

        document.body.className = document.body.className.replace(/\broute-\S+/g, '');
        document.body.classList.add(`route-${filteredRoute.replace('/', '')}`);
    }, [location]);

    return null;
}

function Todo() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const userid = location.state?.userid;
    const task_date = location.state?.task_date;

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                console.log("task_date in app:", task_date);
                const response = await fetch('http://localhost:3002/get-tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userid, task_date: task_date })
                });
                const data = await response.json();
                if (data.success) {
                    console.log('Fetched tasks:', data.data);
                    setTasks(data.data);
                } else {
                    console.error("Failed to fetch tasks:", data.message);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
            setIsLoading(false);
        };

        if (userid) {
            fetchTasks();
        }
    }, [userid]);

    useEffect(() => {
        if (tasks.length === 0) return;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        setTasks(tasks || []);
    }, []);



    function addTask(newTask) {
        setTasks(prev => [...prev, newTask]);
    }

    function updateTaskDone(taskIndex, newDone) {
        setTasks(prev => prev.map((task, index) => index === taskIndex ? {...task, done: newDone} : task));
    }

    function removeTask(indexToRemove) {
        setTasks(prev => prev.filter((_, index, taskId) => index !== indexToRemove));
    }


    return (
        <div className="main-page">
            <div className="main-container">
                <Link to="/calendar" state={{ userid, task_date }}>
                    <button className="calendar-button">{'<'}</button>
                </Link>
                <TaskForm onAdd={addTask} userid={userid} />
                {tasks.map((task, index) => (
                    <NewTask
                        key={task.task_id}
                        name={task.task_name}
                        task_id={task.task_id}
                        onTrash={() => removeTask(index)}
                        onToggle={done => updateTaskDone(index, done)}
                    />
                ))}
            </div>
        </div>
    );
}


function App() {
    return (
        <BrowserRouter>
            <UseLocationComponent />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/emailpage" element={<EmailPage />} />
                <Route path="/passwordpage/:userId" element={<PasswordPage />} />
                <Route path="/calendar" element={<Calendar />}/>
                <Route path="/todo" element={<Todo />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
