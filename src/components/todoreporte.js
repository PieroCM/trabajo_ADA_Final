import React, { useEffect, useState } from 'react';
import { Table, Input, message, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ReportesPedidos = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Datos filtrados
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState(''); // Texto de búsqueda
    const navigate = useNavigate(); // Hook para navegación

    useEffect(() => {
        // Llamada a la API para obtener los datos
        fetch('http://localhost:3001/api/pedidos')
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setData(result.data); // Guardar datos originales
                    setFilteredData(result.data); // Inicializar datos filtrados
                } else {
                    message.warning(result.message || 'No se encontraron datos.');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al cargar los datos:', error);
                message.error('Ocurrió un error al cargar los datos.');
                setLoading(false);
            });
    }, []);

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = data.filter((record) => {
            // Comprobar los campos a buscar
            return (
                record['p.fecha']?.toLowerCase().includes(value) ||
                record['p.cliente']?.toLowerCase().includes(value) ||
                record['pr.nombre']?.toLowerCase().includes(value)
            );
        });

        setFilteredData(filtered);
    };

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
            sorter: (a, b) => new Date(a['p.fecha']) - new Date(b['p.fecha']),
        },
        {
            title: 'Cliente',
            dataIndex: 'p.cliente',
            key: 'p.cliente',
        },
        {
            title: 'Empleado',
            key: 'empleado',
            render: (text, record) =>
                `${record.empleado_nombre} ${record.empleado_apellido}`,
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
            <div
                style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Input
                    placeholder="Buscar por fecha, cliente o producto"
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ width: '300px' }}
                />
                <div>
                    <Button
                        onClick={() => setFilteredData(data)}
                        style={{ marginRight: '10px' }}
                    >
                        Resetear filtros
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => navigate(-1)} // Navegar a la pantalla principal
                    >
                        Regresar
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData} // Fuente de datos filtrados
                loading={loading}
                rowKey="idpedido"
                bordered
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ReportesPedidos;
