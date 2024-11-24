const express = require('express'); 
const router = express.Router();
const db = require('./dbConnection'); // Conexión a la base de datos

// Ruta para obtener el reporte de pedidos
router.get('/api/pedidos', (req, res) => {
    const query = `
        SELECT 
            p.idpedido,
            m.numero_mesa,
            p.fecha,
            p.cliente,
            e.nombre AS empleado_nombre,
            e.apellido AS empleado_apellido,
            dp.cantidad,
            pr.nombre AS producto_nombre
        FROM pedidos p
        JOIN mesas m ON p.idmesa = m.idmesa
        JOIN empleados e ON p.idempleado = e.idempleado
        JOIN detalle_pedido dp ON p.idpedido = dp.idpedido
        JOIN productos pr ON dp.idproducto = pr.idproducto
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener datos de pedidos:', err);
            res.status(500).json({ success: false, error: 'Error al obtener el reporte de pedidos' });
        } else if (rows.length === 0) {
            res.json({ success: true, message: 'No hay pedidos registrados aún', data: [] });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
