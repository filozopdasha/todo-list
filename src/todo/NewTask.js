import React, { useState, useEffect } from 'react';
import Checkbox from './Checkbox';

export default function NewTask({ name, done, onToggle, task_id, onTrash }) {
    const [isChecked, setIsChecked] = useState(done);

    useEffect(() => {
        const storedTask = localStorage.getItem(`task_${task_id}`);
        if (storedTask !== null) {
            const { checked } = JSON.parse(storedTask);
            setIsChecked(checked);
        }
    }, [task_id]);

    const toggleCheckbox = async () => {
        try {
            const updatedCheckedValue = !isChecked;
            setIsChecked(updatedCheckedValue);
            onToggle(updatedCheckedValue);

            const taskObject = { name, checked: updatedCheckedValue };
            localStorage.setItem(`task_${task_id}`, JSON.stringify(taskObject));

            const response = await fetch(`http://localhost:3002/update-task/${task_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task_checked: updatedCheckedValue }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update task checked state. Server returned status ${response.status}`);
            }

            const data = await response.json();
            console.log('Response from server:', data);

            console.log('Task checked state updated successfully in the database.');
        } catch (error) {
            console.error('Error updating task checked state:', error);
        }
    };

    const deleteTask = async () => {
        try {
            const response = await fetch(`http://localhost:3002/delete-task/${task_id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                localStorage.removeItem(`task_${task_id}`);
                onTrash(task_id);
                console.log('Task deleted successfully from the database.');
            } else {
                console.error('Failed to delete task from the database:', data.message);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className={`task ${isChecked ? 'done' : ''}`}>
            <Checkbox checked={isChecked} onClick={toggleCheckbox} />
            {name}
            <div onClick={deleteTask} className="delete-button">
                ✖
            </div>
        </div>
    );
}