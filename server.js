// server.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // This allows the server to accept JSON data in the request body

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username (default is often 'root')
    password: 'root', // Your MySQL password
    database: 'inventory_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// === API ENDPOINTS (CRUD OPERATIONS) ===

// CREATE: Add a new product
app.post('/api/products', (req, res) => {
    const { name, quantity, price } = req.body;
    const sql = 'INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)';
    db.query(sql, [name, quantity, price], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ message: 'Product added successfully!', id: result.insertId });
    });
});

// READ: Get all products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// UPDATE: Modify an existing product
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    const sql = 'UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?';
    db.query(sql, [name, quantity, price, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Product not found.' });
        }
        res.send({ message: 'Product updated successfully!' });
    });
});

// DELETE: Remove a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Product not found.' });
        }
        res.send({ message: 'Product deleted successfully!' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});