import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Calendar.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const location = useLocation();
    const navigate = useNavigate();
    const [taskDates, setTaskDates] = useState([]);

    useEffect(() => {
        const fetchTaskDates = async () => {
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const user_id = location.state?.userid;


            try {
                const response = await fetch('http://localhost:3002/get-task_dates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ month, year, user_id }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const formattedTaskDates = data.data.map(task => {
                        const parts = task.task_date.split(',')[0].split('.');
                        return {
                            date: `${parts[2]}-${parts[1]}-${parts[0]}`,
                            allChecked: task.all_checked
                        };
                    });
                    setTaskDates(formattedTaskDates)
                } else {
                    console.error("Failed to fetch tasks");
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTaskDates();
    }, [currentDate]);



    const daysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return new Date(year, month, 0).getDate();
    };

    const startOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1);
    };

    const generateCalendar = () => {
        const firstDayIndex = startOfMonth(currentDate).getDay();
        const totalDays = daysInMonth(currentDate);
        const calendar = [];
        const rows = 6;

        for (let i = 0; i < rows; i++) {
            const row = [];

            for (let j = 0; j < 7; j++) {
                const dayIndex = i * 7 + j;
                const dayNumber = dayIndex - firstDayIndex + 1;

                if (dayNumber > 0 && dayNumber <= totalDays) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                    const dateString = [
                        date.getFullYear(),
                        String(date.getMonth() + 1).padStart(2, '0'),
                        String(date.getDate()).padStart(2, '0')
                    ].join('-');



                    row.push({
                        date,
                        hasTask: taskDates.some(task => task.date === dateString),
                        allTasksChecked: taskDates.some(task => task.date === dateString && task.allChecked)
                    });

                } else {
                    row.push(null);
                }
            }
            calendar.push(row);
        }

        return calendar;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const calendar = generateCalendar();
    console.log('userid:', location.state?.userid);

    const handleDateClick = (userId, date) => {
        const formattedDate = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('-');

        navigate(`/todo`, { state: { userid: userId, task_date: formattedDate } });
    };


        return (

        <div className="Calendar-container">
            <Link to="/" className="logout-button">
                Log Out
            </Link>
            <div className="Calendar-header">
                <button className='arrow' onClick={handlePrevMonth}>&lt;</button>
                <h2 className="month-and-year">{currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <button  className='arrow' onClick={handleNextMonth}>&gt;</button>
            </div>
            <table className="Calendar-table">
                <thead>
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
                </thead>
                <tbody>
                {calendar.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td key={colIndex} className={
                                cell && cell.hasTask
                                    ? cell.allTasksChecked ? "all-tasks-checked" : "has-task"
                                    : ""}>
                                {cell && cell.date && (
                                    <button
                                        onClick={() => handleDateClick(location.state?.userid, cell.date)}
                                        className="date-button"
                                    >
                                        {cell.date.getDate()}
                                    </button>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
