const express = require('express');
const router = express.Router();
const db = require('./dbConnection'); // Asegúrate de tener la conexión a la BD configurada

// Obtener todas las mesas
router.get('/api/mesas', (req, res) => {
  const sql = 'SELECT * FROM mesas';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Crear nueva mesa
router.post('/api/mesas', (req, res) => {
  const { numero_mesa } = req.body;
  const sql = 'INSERT INTO mesas (numero_mesa) VALUES (?)';
  
  db.run(sql, [numero_mesa], function(err) {
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

// Actualizar mesa
router.put('/api/mesas/:id', (req, res) => {
  const { numero_mesa } = req.body;
  const sql = 'UPDATE mesas SET numero_mesa = ? WHERE idmesa = ?';
  
  db.run(sql, [numero_mesa, req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Eliminar mesa
router.delete('/api/mesas/:id', (req, res) => {
  const sql = 'DELETE FROM mesas WHERE idmesa = ?';
  
  db.run(sql, req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

module.exports = router;
