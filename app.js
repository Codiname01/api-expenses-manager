const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./expenses.db');

app.use(bodyParser.json());

// Crear tabla si no existe
db.run('CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY, description TEXT, amount REAL, date TEXT)');

// Rutas
app.get('/expenses', (req, res) => {
    db.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.json(rows);
    });
});

app.post('/expenses', (req, res) => {
    const { description, amount, date } = req.body;
    db.run('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)', [description, amount, date], function (err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
