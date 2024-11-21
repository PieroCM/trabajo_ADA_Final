const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

// Ruta para obtener los tipos de producto
router.get('/tipos', (req, res) => {
    const getTiposQuery = `
        SELECT idtipoproducto, nombre
        FROM tiposdeproducto
    `;
    db.all(getTiposQuery, [], (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, error: 'Error al obtener los tipos de producto' });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;

