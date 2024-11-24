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
                record.fecha?.toLowerCase().includes(value) ||
                record.cliente?.toLowerCase().includes(value) ||
                record.producto?.toLowerCase().includes(value)
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
            sorter: (a, b) => a.idpedido - b.idpedido, // Ordenar numéricamente
            defaultSortOrder: 'ascend', // Orden ascendente por defecto
        },
        
        {
            title: 'Número de Mesa',
            dataIndex: 'numero_mesa',
            key: 'numero_mesa',
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
            sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
            render: (fecha) => {
                // Formatear la fecha con Intl.DateTimeFormat
                const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Intl.DateTimeFormat('es-ES', opciones).format(new Date(fecha));
                // Ejemplo alternativo (DD/MM/YYYY):
                // return new Date(fecha).toLocaleDateString('es-ES');
            },
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
        },
        {
            title: 'Empleado',
            key: 'empleado',
            render: (text, record) =>
                `${record.empleado_nombre} ${record.empleado_apellido}`,
        },
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
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
