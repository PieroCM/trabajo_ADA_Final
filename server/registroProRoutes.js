const express = require('express'); 
const router = express.Router();
const db = require('./dbConnection');
const multer = require('multer');


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
        } else if (rows.length === 0) {
            res.json({ success: true, message: 'No hay data todavía en la tabla Productos', data: [] });
        } else {
            res.json(rows);
        }
    });
});
// Ruta para actualizar un producto
router.put('/actualizarProducto', upload.single('imagen'), (req, res) => {
    const { idproducto, idtipoproducto, nombre, precio, cantidad } = req.body;

    // Mostrar los datos recibidos antes de realizar el UPDATE
    console.log('Datos recibidos para actualización:', {
        idproducto,
        idtipoproducto,
        nombre,
        precio,
        cantidad,
        imagen_url: req.file ? `/imagenesProduct/${req.file.filename}` : 'Sin cambios (mantener imagen actual)',
    });

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


module.exports = router;

