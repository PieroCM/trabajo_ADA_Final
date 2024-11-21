const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagenesProduct'); // Carpeta para guardar imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generar un nombre único
    },
});
const upload = multer({ storage });

// Ruta para guardar un producto
router.post('/guardarProducto', upload.single('imagen'), (req, res) => {
    const { idtipoproducto, nombre, precio, cantidad } = req.body;
    const imagen_url = req.file ? `/imagenesProduct/${req.file.filename}` : null;

    // Insertar en la tabla productos
    const insertProductoQuery = `
        INSERT INTO productos (idtipoproducto, nombre, precio, imagen_url)
        VALUES (?, ?, ?, ?)
    `;
    db.run(insertProductoQuery, [idtipoproducto, nombre, precio, imagen_url], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: 'Error al insertar el producto' });
            return;
        }

        const idProducto = this.lastID; // ID del producto recién insertado

        // Insertar en la tabla stock
        const insertStockQuery = `
            INSERT INTO stock (idproducto, cantidad)
            VALUES (?, ?)
        `;
        db.run(insertStockQuery, [idProducto, cantidad], (err) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Error al insertar en el stock' });
            } else {
                res.json({ success: true, message: 'Producto registrado con éxito' });
            }
        });
    });
});

// Ruta para obtener la lista de productos (con INNER JOIN)
router.get('/productos', (req, res) => {
    const getProductosQuery = `
        SELECT 
            p.idproducto,
            p.nombre,
            p.precio,
            s.cantidad,
            t.nombre AS descripcion
        FROM productos p
        INNER JOIN stock s ON p.idproducto = s.idproducto
        INNER JOIN tiposdeproducto t ON p.idtipoproducto = t.idtipoproducto
    `;
    db.all(getProductosQuery, [], (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, error: 'Error al obtener los productos' });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
