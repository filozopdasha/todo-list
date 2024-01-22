import '../App.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TaskForm({ onAdd }) {
    const [task_name, setTaskName] = useState('');
    const [userid, setUserId] = useState(null);
    const [task_date, setTaskDate] = useState(null);

    const location = useLocation();

    useEffect(() => {
        setUserId(location.state?.userid || null);
        setTaskDate(location.state?.task_date || null);
    }, [location.state]);

    const handleAddTask = async () => {
        try {
            console.log('userid:', userid);
            const response = await fetch('http://localhost:3002/add-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_name: task_name,

                    task_checked: false,
                    user_id: userid,
                    task_date: task_date,
                }),
            });

            const data = await response.json();

            if (data.success) {
                console.log(data.data);
                onAdd(data.data);
                setTaskName('');
            } else {
                console.error('Failed to add task:', data.message);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        await handleAddTask();
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" className="add-button">+</button>
            <input
                className="input-field"
                type="text"
                value={task_name}
                onChange={(ev) => setTaskName(ev.target.value)}
                placeholder="Your next task"
            />
        </form>
    );
}
