const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');
const sendgrid = require("@sendgrid/mail");
const app = express();
sendgrid.setApiKey("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")

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ToDo',
    password: '200720041210',
    port: 5432,
});


app.post('/signup', async (req, res) => {
    const { name, surname, user_email, password } = req.body;
    console.log(user_email + " asd")
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE user_email = $1', [user_email]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (user_name, user_surname, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, surname, user_email, hashedPassword]
        );

        res.status(201).json({ success: true, message: 'User registered successfully.', data: result.rows[0] });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: error });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    try {
        const queryResult = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);

        if (queryResult.rows.length > 0) {
            const user = queryResult.rows[0];

            const passwordMatch = await bcrypt.compare(password, user.user_password);

            if (passwordMatch) {
                const userQueryResult = await pool.query('SELECT user_id FROM users WHERE user_email = $1', [email]);
                console.log(userQueryResult);


                if (userQueryResult.rows.length > 0) {
                    const user_id = userQueryResult.rows[0].user_id;


                    res.json({ success: true, message: 'Authentication successful!', user_id: user_id });

                } else {
                    res.status(500).json({ success: false, message: 'Error retrieving user_id.' });
                }
            } else {
                res.status(401).json({ success: false, message: 'Password is incorrect.' });
            }
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/add-task', async (req, res) => {
    const { task_name, task_checked, user_id, task_date } = req.body;
    console.log("date:", task_date);
    try {
        console.log('id:', user_id);
        const result = await pool.query(
            'INSERT INTO tasks (task_name, task_checked, user_id, task_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [task_name, task_checked, user_id, task_date]
        );
        console.log(result.rows[0]);
        res.status(201).json({ success: true, message: 'Task added successfully.', data: result.rows[0] });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});

app.put('/update-task/:id', async (req, res) => {
    const { task_checked } = req.body;
    const { id } = req.params;
    console.log('Received task ID:', id);

    try {
        const result = await pool.query(
            'UPDATE tasks SET task_checked = $1 WHERE task_id = $2 RETURNING *',
            [task_checked, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        res.status(200).json({ success: true, message: 'Task updated successfully.', data: result.rows[0] });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});


app.delete('/delete-task/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE task_id = $1', [id]
        );
        console.log(result.rows[0])
        res.status(201).json({ success: true, message: 'Task added successfully.', data: result.rows[0] });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});

app.post('/get-tasks', async (req, res) => {
    try {
        const { user_id, task_date } = req.body;
        const result = await pool.query(
            'SELECT * FROM tasks where user_id = $1 AND task_date = $2 ORDER BY task_id asc', [user_id, task_date]
        );
        console.log(result.rows)
        res.status(201).json({ success: true, message: 'Tasks retrieved successfully.', data: result.rows });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});

app.post('/get-task_dates', async (req, res) => {
    try {
        const { month, year, user_id } = req.body;
        console.log("Received user_id:", user_id);
        console.log("asd " + month, year, user_id);
        const result = await pool.query(
            'SELECT task_date, BOOL_AND(task_checked) as all_checked FROM tasks WHERE EXTRACT(MONTH FROM task_date) = $1 AND EXTRACT(YEAR FROM task_date) = $2 AND user_id = $3 GROUP BY task_date;',
            [month, year, user_id]
        );
        const taskDates = result.rows.map(row => {
            const localTime = new Date(row.task_date).toLocaleString();
            return {
                ...row,
                task_date: localTime
            };
        });

        console.log(taskDates)
        res.status(201).json({ success: true, message: 'Tasks retrieved successfully.', data: taskDates });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});

app.post("/check-user-existence", async (req, res) => {
    try {
        const { user_email } = req.body;
        const result = await pool.query(
            'SELECT user_id FROM users WHERE user_email = $1 LIMIT 1;',
            [user_email]
        );

        if (result.rows.length === 1) {
            const user_id = result.rows[0].user_id;

            const msg = {
                to: user_email,
                from: 'filozopdashaaa@gmail.com',
                subject: 'Reseting Password',
                text: ' New Password',
                html: `<strong>Click <a href="http://localhost:3000/passwordpage/${user_id}">here</a> to go to the password page</strong>`,
            };

            sendgrid
                .send(msg)
                .then(() => {
                    console.log('Email sent to', user_email);
                })
                .catch((error) => {
                    console.error("Error sending email:", error.response ? error.response.body : error);
                });

            res.status(200).json({ success: true, message: 'Email sent', user_exists: true });
        } else {
            res.status(404).json({ success: true, message: 'User does not exist', user_exists: false });
        }
    } catch (error) {
        console.error('Error while checking users existence:', error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});
app.put('/update-password', async (req, res) => {
    const { user_id, new_password } = req.body;
    console.log('Received user_id:', user_id);
    console.log('New password:', new_password);

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        console.log(userExists);
        if (userExists.rows.length === 1) {
            const hashedPassword = await bcrypt.hash(new_password, 10);

            const result = await pool.query(
                'UPDATE users SET user_password = $1 WHERE user_id = $2 RETURNING *',
                [hashedPassword, user_id]
            );

            res.status(200).json({ success: true, message: 'Password updated successfully', data: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});



app.listen(3002, () => {
    console.log('Server running on port 3002');
});
