const express = require('express'); 
const router = express.Router();
const db = require('./dbConnection'); // Conexión a la base de datos

// Ruta para obtener el reporte de pedidos
// Ruta para obtener pedidos
router.get('/api/pedidos', (req, res) => {
    const query = `
        SELECT 
    p.idpedido as idpedido, 
    m.numero_mesa AS numero_mesa,
    p.fecha AS fecha,
    p.nombreCliente AS cliente,
    e.nombre AS empleado_nombre,
    e.apellido AS empleado_apellido,
    pr.nombre AS producto,
    dp.cantidad AS cantidad
FROM pedidos p
JOIN mesas m ON p.idmesa = m.idmesa
JOIN empleados e ON p.idempleado = e.idempleado
JOIN detallepedidos dp ON p.idpedido = dp.idpedido
JOIN productos pr ON dp.idproducto = pr.idproducto
ORDER BY p.fecha DESC;

    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener pedidos:', err); // Imprime el error en consola
            return res.status(500).json({ success: false, message: 'Error al obtener los pedidos.' });
        }
        res.json({ success: true, data: rows });
    });
});


module.exports = router;
