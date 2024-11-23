const express = require('express');
const router = express.Router();
const db = require('./dbConnection'); // Asegúrate de tener la conexión a la BD configurada

// Obtener todos los clientes
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM clientes';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Crear nuevo cliente
router.post('/', (req, res) => {
  const { nombre, telefono } = req.body;
  const sql = 'INSERT INTO clientes (nombre, telefono) VALUES (?, ?)';
  
  db.run(sql, [nombre, telefono], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      id: this.lastID
    });
  });
});

// Actualizar cliente
router.put('/:id', (req, res) => {
  const { nombre, telefono } = req.body;
  const sql = 'UPDATE clientes SET nombre = ?, telefono = ? WHERE idcliente = ?';
  
  db.run(sql, [nombre, telefono, req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Eliminar cliente
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM clientes WHERE idcliente = ?';
  
  db.run(sql, req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

module.exports = router;