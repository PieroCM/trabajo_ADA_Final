const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

// Ruta para registrar un empleado
router.post('/registroEmpleado', (req, res) => {
    const { nombre, apellido, sexo, edad, usuario, contraseña } = req.body;

    // Insertar el empleado en la tabla empleados
    const insertEmpleadoQuery = `
        INSERT INTO empleados (nombre, apellido, sexo, edad)
        VALUES (?, ?, ?, ?)
    `;
    db.run(insertEmpleadoQuery, [nombre, apellido, sexo, edad], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: 'Error al insertar el empleado' });
            return;
        }

        const idEmpleado = this.lastID; // Obtiene el ID del empleado recién creado

        // Insertar el usuario relacionado en la tabla usuarios
        const insertUsuarioQuery = `
            INSERT INTO usuarios (usuario, contraseña, idempleado)
            VALUES (?, ?, ?)
        `;
        db.run(insertUsuarioQuery, [usuario, contraseña, idEmpleado], (err) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Error al insertar el usuario' });
            } else {
                res.json({ success: true, message: 'Empleado y usuario registrados con éxito' });
            }
        });
    });
});

module.exports = router;
