const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ruta de la carpeta donde se guardarán las imágenes
const IMAGES_DIR = path.join(__dirname, '../imagenesProduct');

// Verificar si la carpeta existe, y si no, crearla
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`Carpeta creada: ${IMAGES_DIR}`);
}

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR); // Carpeta para guardar imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generar un nombre único
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
        }
    },
});

// Ruta para guardar un producto
router.post('/guardarProducto', upload.single('imagen'), (req, res) => {
    const { idtipoproducto, nombre, precio, cantidad } = req.body;

    console.log('Datos recibidos en el backend:', req.body);
    console.log('Archivo recibido:', req.file);

    if (!req.file) {
        console.error('No se ha subido ninguna imagen');
        return res.status(400).json({ success: false, error: 'No se ha subido ninguna imagen' });
    }

    const imagen_url = `/imagenesProduct/${req.file.filename}`;

    const insertProductoQuery = `
        INSERT INTO productos (idtipoproducto, nombre, precio, imagen_url)
        VALUES (?, ?, ?, ?)
    `;
    db.run(insertProductoQuery, [idtipoproducto, nombre, precio, imagen_url], function (err) {
        if (err) {
            console.error('Error al insertar el producto:', err);
            res.status(500).json({ success: false, error: 'Error al insertar el producto' });
            return;
        }

        const idProducto = this.lastID;

        const insertStockQuery = `
            INSERT INTO stock (idproducto, cantidad)
            VALUES (?, ?)
        `;
        db.run(insertStockQuery, [idProducto, cantidad], (err) => {
            if (err) {
                console.error('Error al insertar en el stock:', err);
                res.status(500).json({ success: false, error: 'Error al insertar en el stock' });
            } else {
                console.log('Producto registrado con éxito:', { idProducto, nombre, precio, imagen_url });
                res.json({ success: true, message: 'Producto registrado con éxito' });
            }
        });
    });
});

// Ruta para actualizar un producto
router.put('/actualizarProducto', upload.single('imagen'), (req, res) => {
    const { idproducto, idtipoproducto, nombre, precio, cantidad } = req.body;

    console.log('Datos recibidos para actualización:', req.body);

    let imagen_url = null;
    if (req.file) {
        imagen_url = `/imagenesProduct/${req.file.filename}`;
    }

    const updateProductoQuery = `
        UPDATE productos
        SET idtipoproducto = ?, nombre = ?, precio = ?, imagen_url = COALESCE(?, imagen_url)
        WHERE idproducto = ?
    `;
    db.run(updateProductoQuery, [idtipoproducto, nombre, precio, imagen_url, idproducto], function (err) {
        if (err) {
            console.error('Error al actualizar el producto:', err);
            res.status(500).json({ success: false, error: 'Error al actualizar el producto' });
            return;
        }

        const updateStockQuery = `
            UPDATE stock
            SET cantidad = ?
            WHERE idproducto = ?
        `;
        db.run(updateStockQuery, [cantidad, idproducto], (err) => {
            if (err) {
                console.error('Error al actualizar el stock:', err);
                res.status(500).json({ success: false, error: 'Error al actualizar el stock' });
            } else {
                console.log('Producto actualizado con éxito:', { idproducto, nombre, precio, imagen_url });
                res.json({ success: true, message: 'Producto actualizado con éxito' });
            }
        });
    });
});

// Ruta para eliminar un producto
router.delete('/eliminarProducto/:idproducto', (req, res) => {
    const { idproducto } = req.params;

    console.log('ID del producto a eliminar:', idproducto);

    const deleteStockQuery = `
        DELETE FROM stock WHERE idproducto = ?
    `;
    db.run(deleteStockQuery, [idproducto], (err) => {
        if (err) {
            console.error('Error al eliminar el stock:', err);
            res.status(500).json({ success: false, error: 'Error al eliminar el stock' });
            return;
        }

        const deleteProductoQuery = `
            DELETE FROM productos WHERE idproducto = ?
        `;
        db.run(deleteProductoQuery, [idproducto], (err) => {
            if (err) {
                console.error('Error al eliminar el producto:', err);
                res.status(500).json({ success: false, error: 'Error al eliminar el producto' });
            } else {
                console.log('Producto eliminado con éxito:', idproducto);
                res.json({ success: true, message: 'Producto eliminado con éxito' });
            }
        });
    });
});

// Ruta para obtener la lista de productos
router.get('/productos', (req, res) => {
    const getProductosQuery = `
        SELECT 
            p.idproducto,
            p.nombre,
            p.precio,
            s.cantidad,
            t.nombre AS descripcion,
            p.imagen_url
        FROM productos p
        INNER JOIN stock s ON p.idproducto = s.idproducto
        INNER JOIN tiposdeproducto t ON p.idtipoproducto = t.idtipoproducto
    `;
    db.all(getProductosQuery, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los productos:', err);
            res.status(500).json({ success: false, error: 'Error al obtener los productos' });
        } else {
            console.log('Productos obtenidos:', rows);
            res.json(rows);
        }
    });
});

module.exports = router;
