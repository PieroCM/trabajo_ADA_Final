-- SQLite
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
ORDER BY p.fecha ASC;