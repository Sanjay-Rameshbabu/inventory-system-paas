// server.js (UPDATED FOR DEPLOYMENT)

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path'); // Add the 'path' module

// Load environment variables from a .env file during development
// You will need to run: npm install dotenv
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- SERVE THE FRONTEND ---
// This will serve the HTML, CSS, and JS files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Create a connection to the MySQL database
// We use process.env to get credentials from the environment
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// === API ENDPOINTS (No changes needed here) ===

// CREATE
app.post('/api/products', (req, res) => {
    // ... same as before
    const { name, quantity, price } = req.body;
    const sql = 'INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)';
    db.query(sql, [name, quantity, price], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Product added successfully!', id: result.insertId });
    });
});

// READ
app.get('/api/products', (req, res) => {
    // ... same as before
    const sql = 'SELECT * FROM products ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// UPDATE
app.put('/api/products/:id', (req, res) => {
    // ... same as before
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    const sql = 'UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?';
    db.query(sql, [name, quantity, price, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Product not found.' });
        res.send({ message: 'Product updated successfully!' });
    });
});

// DELETE
app.delete('/api/products/:id', (req, res) => {
    // ... same as before
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Product not found.' });
        res.send({ message: 'Product deleted successfully!' });
    });
});

// Let the PaaS environment set the port, but default to 3000 for local development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



