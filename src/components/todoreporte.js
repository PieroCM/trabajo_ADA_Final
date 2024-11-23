import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';

const ReportesPedidos = () => {
    const [data, setData] = useState([]); // Estado para almacenar los datos
    const [loading, setLoading] = useState(true); // Estado para manejar el cargado

    useEffect(() => {
        // Llamada a la API para obtener los datos
        fetch('http://localhost:3001/api/reporteRouter/pedidos')
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    setData(result.data); // Guardar los datos
                } else {
                    message.warning(result.message || 'No se encontraron datos.');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                message.error('Ocurrió un error al cargar los datos.');
                setLoading(false);
            });
    }, []);

    // Configuración de las columnas de la tabla
    const columns = [
        {
            title: 'ID Pedido',
            dataIndex: 'idpedido',
            key: 'idpedido',
        },
        {
            title: 'Número de Mesa',
            dataIndex: 'm.numero_mesa',
            key: 'm.numero_mesa',
        },
        {
            title: 'Fecha',
            dataIndex: 'p.fecha',
            key: 'p.fecha',
        },
        {
            title: 'Cliente',
            dataIndex: 'p.cliente',
            key: 'p.cliente', // Muestra directamente el campo cliente
        },
        {
            title: 'Empleado',
            key: 'empleado',
            render: (text, record) =>
                `${record.empleado_nombre} ${record.empleado_apellido}`, // Combinar nombre y apellido
        },
        {
            title: 'Producto',
            dataIndex: 'pr.nombre',
            key: 'pr.nombre',
        },
        {
            title: 'Cantidad',
            dataIndex: 'dp.cantidad',
            key: 'dp.cantidad',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Reporte de Pedidos</h1>
            <Table
                columns={columns}
                dataSource={data} // Fuente de datos
                loading={loading} // Indicador de carga
                rowKey="idpedido" // Identificador único de la fila
                bordered // Bordes para la tabla
                pagination={{ pageSize: 10 }} // Paginación
            />
        </div>
    );
};

export default ReportesPedidos;
