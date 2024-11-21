const express = require('express');
const db = require('./dbConnection'); // Asegúrate de que esto apunta a tu conexión SQLite
const router = express.Router();

// Ruta para validar usuario y contraseña
router.post('/validatePassword', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error al consultar la base de datos' });
        } else if (row) {
            res.json({ validation: true, message: 'Autenticación exitosa', user: row });
        } else {
            res.json({ validation: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});

module.exports = router;
