const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
const path = require('path');

// Configurar la carpeta estática para las imágenes
router.use('/imagenesProduct', express.static(path.join(__dirname, 'imagenesProduct')));

// Ruta para obtener las categorías
router.get('/categories', (req, res) => {
    const getCategoriesQuery = `
        SELECT idtipoproducto, nombre 
        FROM tiposdeproducto
    `;
    db.all(getCategoriesQuery, [], (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, error: 'Error al obtener las categorías' });
        } else {
            res.json(rows);
        }
    });
});

// Ruta para obtener los productos con sus imágenes
router.get('/products', (req, res) => {
    const getProductsQuery = `
        SELECT 
            p.idproducto,
            p.nombre,
            p.precio,
            p.imagen_url,
            p.idtipoproducto,
            s.cantidad
        FROM productos p
        INNER JOIN stock s ON p.idproducto = s.idproducto
    `;
    db.all(getProductsQuery, [], (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, error: 'Error al obtener los productos' });
        } else {
            // Convertir la URL de la imagen en una URL completa
            const productsWithFullImageUrl = rows.map((product) => ({
                ...product,
                imagen_url: product.imagen_url ? `http://localhost:3001${product.imagen_url}` : null,
            }));
            res.json(productsWithFullImageUrl);
        }
    });
});

module.exports = router;
