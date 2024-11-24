import React, { useEffect, useState } from 'react';
import { Table, Input, message, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
            // Normalizar la fecha al formato de búsqueda
            const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
            const fechaNormalizada = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(new Date(record.fecha)).toLowerCase();
    
            // Comprobar si el texto coincide con fecha, cliente o producto
            return (
                fechaNormalizada.includes(value) || // Comparar con la fecha formateada
                record.cliente?.toLowerCase().includes(value) ||
                record.producto?.toLowerCase().includes(value)
            );
        });
    
        setFilteredData(filtered);
    };

    // Función para generar el PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Ordenar datos por idpedido de forma ascendente
        const sortedData = [...filteredData].sort((a, b) => a.idpedido - b.idpedido);

        // Título del reporte
        doc.setFontSize(18);
        doc.text('Reporte de Pedidos', 14, 22);

        // Opciones de tabla
        const tableData = sortedData.map((record) => [
            record.idpedido,
            record.numero_mesa,
            new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(record.fecha)),
            record.cliente,
            `${record.empleado_nombre} ${record.empleado_apellido}`,
            record.producto,
            record.cantidad,
        ]);

        doc.autoTable({
            head: [['ID Pedido', 'Mesa', 'Fecha', 'Cliente', 'Empleado', 'Producto', 'Cantidad']],
            body: tableData,
            startY: 30,
        });

        // Guardar el archivo
        doc.save('ReportePedidos.pdf');
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
                        style={{ marginRight: '10px' }}
                    >
                        Regresar
                    </Button>
                    <Button
                        type="default"
                        onClick={generatePDF} // Generar PDF
                    >
                        Exportar PDF
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
