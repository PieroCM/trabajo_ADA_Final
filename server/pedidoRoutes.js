const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

// Ruta para obtener productos según la categoría seleccionada
router.get('/productos/:categoria', (req, res) => {
    const { categoria } = req.params;

    let condiciones = ''; // Condiciones dinámicas para el WHERE en SQL

    switch (categoria) {
        case 'menu': // Para el menú, incluir 'menu_plato' y 'menu_entrada'
            condiciones = "nombre IN ('menu_plato', 'menu_entrada')";
            break;
        case 'plato_carta': // Solo 'plato carta'
            condiciones = "nombre = 'plato carta'";
            break;
        case 'postres': // Solo 'postres'
            condiciones = "nombre = 'postres'";
            break;
        case 'bebidas': // Solo 'bebidas'
            condiciones = "nombre = 'bebidas'";
            break;
        default:
            return res.status(400).json({ success: false, error: 'Categoría no válida' });
    }

    // Consulta SQL para obtener los productos filtrados
    const query = `
        SELECT 
            p.idproducto, 
            p.nombre, 
            p.precio, 
            s.cantidad AS stock, 
            p.imagen_url 
        FROM productos p
        LEFT JOIN stock s ON p.idproducto = s.idproducto
        WHERE p.idtipoproducto IN (
            SELECT idtipoproducto 
            FROM tiposdeproducto 
            WHERE ${condiciones}
        )
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ success: false, error: 'Error al obtener los productos' });
        }
        res.json(rows);
    });
});

// Ruta para obtener las mesas
router.get('/mesas', (req, res) => {
    const query = `
        SELECT idmesa, numero_mesa 
        FROM mesas
        ORDER BY numero_mesa ASC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener mesas:', err);
            return res.status(500).json({ success: false, error: 'Error al obtener las mesas' });
        }
        res.json(rows);
    });
});

// Ruta para realizar un pedido
router.post('/realizarPedido', async (req, res) => {
    const { idmesa, nombreCliente, productos, idempleado } = req.body; // Datos del frontend
    const fecha = new Date().toISOString(); // Fecha actual
    const estado = 'Realizado';

    if (!idmesa || !productos || productos.length === 0) {
        return res.status(400).json({ success: false, message: 'Faltan datos necesarios para realizar el pedido.' });
    }

    try {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // Insertar en la tabla pedidos
            const queryInsertPedido = `
                INSERT INTO pedidos (idmesa, nombreCliente, fecha, estado, idempleado)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.run(
                queryInsertPedido,
                [idmesa, nombreCliente || 'Sin Nombre', fecha, estado, idempleado],
                function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ success: false, message: 'Error al crear el pedido', error: err });
                    }

                    const idpedido = this.lastID; // Obtener el ID del pedido recién creado

                    // Insertar en detallepedidos y actualizar stock
                    const queryInsertDetalle = `
                        INSERT INTO detallepedidos (idpedido, idproducto, cantidad)
                        VALUES (?, ?, ?)
                    `;
                    const queryUpdateStock = `
                        UPDATE stock
                        SET cantidad = cantidad - ?
                        WHERE idproducto = ? AND cantidad >= ?
                    `;

                    let errorEnProductos = false;

                    productos.forEach((producto) => {
                        const { idproducto, cantidad } = producto;

                        if (!idproducto || cantidad <= 0) {
                            errorEnProductos = true;
                            return;
                        }

                        // Actualizar stock
                        db.run(queryUpdateStock, [cantidad, idproducto, cantidad], function (err) {
                            if (err || this.changes === 0) {
                                errorEnProductos = true;
                                return;
                            }

                            // Insertar en detallepedidos
                            db.run(queryInsertDetalle, [idpedido, idproducto, cantidad], function (err) {
                                if (err) {
                                    errorEnProductos = true;
                                    return;
                                }
                            });
                        });
                    });

                    if (errorEnProductos) {
                        db.run('ROLLBACK');
                        return res.status(400).json({ success: false, message: 'Error en los productos. Verifica el stock.' });
                    }

                    // Confirmar transacción
                    db.run('COMMIT', (err) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Error al confirmar el pedido', error: err });
                        }
                        return res.status(200).json({ success: true, message: 'Pedido realizado exitosamente' });
                    });
                }
            );
        });
    } catch (error) {
        db.run('ROLLBACK');
        return res.status(500).json({ success: false, message: 'Error al realizar el pedido', error });
    }
});

module.exports = router;
