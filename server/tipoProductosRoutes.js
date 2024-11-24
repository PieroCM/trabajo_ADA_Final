const express = require('express');
const router = express.Router();
const db = require('./dbConnection'); // Conexión a la base de datos

// Obtener todos los tipos de producto
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM tiposdeproducto';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener tipos de producto:', err);
      res.status(500).json({ error: 'Error al obtener tipos de producto' });
      return;
    }
    res.json(rows);
  });
});

// Crear nuevo tipo de producto
router.post('/', (req, res) => {
  const { nombre } = req.body;

  console.log('Datos recibidos en el POST:', req.body); // LOG 1

  if (!nombre) {
    console.error('Nombre no recibido en la solicitud');
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  const sql = 'INSERT INTO tiposdeproducto (nombre) VALUES (?)';
  db.run(sql, [nombre], function (err) {
    if (err) {
      console.error('Error al insertar tipo de producto:', err); // LOG 2
      res.status(500).json({ error: 'Error al insertar tipo de producto' });
      return;
    }

    console.log('Tipo de producto insertado con ID:', this.lastID); // LOG 3
    res.json({ success: true, idtipoproducto: this.lastID });
  });
});

// Actualizar tipo de producto
router.put('/:id', (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  const sql = 'UPDATE tiposdeproducto SET nombre = ? WHERE idtipoproducto = ?';
  db.run(sql, [nombre, req.params.id], function (err) {
    if (err) {
      console.error('Error al actualizar tipo de producto:', err);
      res.status(500).json({ error: 'Error al actualizar tipo de producto' });
      return;
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tipo de producto no encontrado' });
    }

    res.json({ success: true });
  });
});

// Eliminar tipo de producto
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM tiposdeproducto WHERE idtipoproducto = ?';

  db.run(sql, [req.params.id], function (err) {
    if (err) {
      console.error('Error al eliminar tipo de producto:', err);
      res.status(500).json({ error: 'Error al eliminar tipo de producto' });
      return;
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tipo de producto no encontrado' });
    }

    res.json({ success: true });
  });
});

module.exports = router;
