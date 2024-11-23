const express = require('express'); 
const router = express.Router();
const db = require('./dbConnection');


// Ruta para guardar una mesa
router.post('/guardarMesa', (req, res) => {
    const { numero_mesa } = req.body;

    if (!numero_mesa) {
        return res.status(400).json({ success: false, error: 'El campo numero_mesa es obligatorio' });
    }

    // Insertar en la tabla mesas
    const insertMesaQuery = `
        INSERT INTO mesas (numero_mesa)
        VALUES (?)
    `;
    db.run(insertMesaQuery, [numero_mesa], function (err) {
        if (err) {
            console.error('Error al insertar la mesa:', err.message); // Para depurar en consola
            res.status(500).json({ success: false, error: 'Error al insertar la mesa' });
            return;
        }

        const idMesa = this.lastID; // ID de la mesa recién insertada
        res.json({ success: true, message: 'Mesa registrada con éxito', idMesa });
    });
});

// Ruta para obtener la lista de mesas
router.get('/mesas', (req, res) => {
    const getMesasQuery = `
        SELECT idmesa, numero_mesa
        FROM mesas
    `;
    db.all(getMesasQuery, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener las mesas:', err.message); // Para depurar en consola
            res.status(500).json({ success: false, error: 'Error al obtener las mesas' });
        } else if (rows.length === 0) {
            res.json({ success: true, message: 'No hay mesas registradas', data: [] });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
