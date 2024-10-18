// Importamos los módulos necesarios
const express = require('express'); // Framework para crear servidores HTTP de manera sencilla
const bodyParser = require('body-parser'); // Middleware para parsear el cuerpo de las peticiones HTTP (formato JSON)
const sqlite3 = require('sqlite3').verbose(); // Módulo para interactuar con bases de datos SQLite

// Creamos una instancia de Express para manejar el servidor HTTP
const app = express();

// Conectamos a la base de datos SQLite. Si el archivo expenses.db no existe, lo creará.
const db = new sqlite3.Database('./expenses.db');

// Configuramos el middleware bodyParser para que todas las peticiones HTTP con cuerpo en formato JSON se puedan leer correctamente.
app.use(bodyParser.json());

// Crea la tabla "expenses" si no existe, con las columnas id (clave primaria), description (texto), amount (real) y date (texto).
db.run('CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY, description TEXT, amount REAL, date TEXT)');

// Ruta GET para obtener todos los registros de la tabla "expenses"
app.get('/expenses', (req, res) => {
    db.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) {
            // Si ocurre un error en la consulta, respondemos con un estado 400 (error de cliente) y enviamos el mensaje de error
            return res.status(400).send(err.message);
        }
        // Si no hay errores, respondemos con los registros obtenidos en formato JSON
        res.json(rows);
    });
});

// Ruta POST para agregar un nuevo registro a la tabla "expenses"
app.post('/expenses', (req, res) => {
    // Extraemos los campos description, amount y date del cuerpo de la solicitud (request body)
    const { description, amount, date } = req.body;

    // Insertamos el nuevo registro en la base de datos. Usamos ? como placeholders para prevenir inyecciones SQL.
    db.run('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)', [description, amount, date], function (err) {
        if (err) {
            // Si ocurre un error al insertar, respondemos con un estado 400 y el mensaje de error
            return res.status(400).send(err.message);
        }
        // Si la inserción es exitosa, respondemos con el ID del registro recién insertado
        res.status(201).json({ id: this.lastID });
    });
});

// Configuración del puerto: Si el entorno (Render) proporciona un puerto (process.env.PORT), lo usará. Si no, usará el puerto 3000 localmente.
const port = process.env.PORT || 3000;

// Iniciamos el servidor para que escuche en el puerto configurado
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
