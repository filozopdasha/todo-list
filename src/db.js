const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ToDo',
    password: '200720041210',
    port: 5432,
});

app.get('/data', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/getbyid/:id', async (req, res) => { /* розібратись як передати айді в url */
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/getbyusername/:username', async (req, res) => { /* розібратись як передати айді в url */
    try {
        const { username } = req.params;
        const { rows } = await pool.query('SELECT * FROM users WHERE user_name = $1', [username]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/insert', async (req, res) => {
    try {
        const { column1, column2 } = req.body; // Assuming column1 and column2 are the columns you want to insert
        const result = await pool.query('INSERT INTO users (column1, column2) VALUES ($1, $2) RETURNING *', [column1, column2]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Server error');
    }
});


app.listen(3001, () => console.log('Server running'));