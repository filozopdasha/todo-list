const fetch = require('node-fetch');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ToDo',
    password: '200720041210',
    port: 5432,
});
const fetchData1 = async (id) => {
       const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
       return rows;
    }

const fetchData = async (id) => {
    const url = 'http://localhost:3001/getbyid/' + id; // URL to your endpoint

    try {
        const response = await fetch(url); // Make the request to the server
        const data = await response.json(); // Parse the JSON from the response

        return data;
    } catch (error) {
        // Log any errors
        console.error('Error fetching data:', error);
    }
};

const fetchData2 = async (username) => {
    const url = 'http://localhost:3001/getbyusername/' + username; // URL to your endpoint

    try {
        const response = await fetch(url); // Make the request to the server
        const data = await response.json(); // Parse the JSON from the response

        // Log the result to the console
        return data;
    } catch (error) {
        // Log any errors
        console.error('Error fetching data:', error);
    }
};
const insertData = async (data) => {
    const url = 'http://localhost:3001/insert'; // URL for your insert endpoint

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Replace 'data' with the actual data you want to insert
        });

        const result = await response.json(); // Parse the JSON from the response

        // Log the result to the console
        console.log('Insert result:', result);
    } catch (error) {
        // Log any errors
        console.error('Error inserting data:', error);
    }
};

// Usage example
const dataToInsert = {
    column1: 'Value1', // Replace with your data
    column2: 'Value2', // Replace with your data
};

(async () => {
    const data = await fetchData1(2); // Replace with actual username
    console.log(data);
})();

module.exports = fetchData1;

