import React, { useState, useEffect } from 'react';
import { Menu, Card, Row, Col, message, Button, Input } from 'antd';
import axios from 'axios';

const { Meta } = Card;

export default function RegistroPedidos() {
    const [productos, setProductos] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState('menu');
    const [mesas, setMesas] = useState([]);
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [carrito, setCarrito] = useState({});
    const [nombreCliente, setNombreCliente] = useState(''); // Campo para el nombre del cliente

    // Obtener productos por categoría
    const fetchProductos = async (categoria) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/pedidoRoutes/productos/${categoria}`);
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            message.error('Error al cargar los productos');
        }
    };

    // Obtener mesas disponibles
    const fetchMesas = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/pedidoRoutes/mesas');
            setMesas(response.data);
            setMesaSeleccionada(response.data[0]?.idmesa || null);
        } catch (error) {
            console.error('Error al cargar las mesas:', error);
            message.error('Error al cargar las mesas');
        }
    };

    // Añadir producto al carrito
    const handleProductoSeleccionado = (producto) => {
        if (!mesaSeleccionada) {
            message.warning('Por favor, selecciona una mesa primero.');
            return;
        }

        if (producto.cantidad <= 0) {
            message.error(`El producto "${producto.nombre}" no tiene stock disponible.`);
            return;
        }

        const carritoActual = { ...carrito };
        if (!carritoActual[mesaSeleccionada]) carritoActual[mesaSeleccionada] = [];

        const index = carritoActual[mesaSeleccionada].findIndex((item) => item.idproducto === producto.idproducto);

        if (index !== -1) {
            if (carritoActual[mesaSeleccionada][index].cantidad < producto.cantidad) {
                carritoActual[mesaSeleccionada][index].cantidad += 1;
            } else {
                message.warning(`No hay suficiente stock para agregar más unidades de "${producto.nombre}".`);
            }
        } else {
            carritoActual[mesaSeleccionada].push({ ...producto, cantidad: 1 });
        }

        setCarrito(carritoActual);
        message.success(`Añadido ${producto.nombre} a la mesa ${mesaSeleccionada}`);
    };

    // Cambiar categoría de productos
    const handleMenuClick = (categoria) => {
        setCategoriaActual(categoria);
        fetchProductos(categoria);
    };

    // Cambiar mesa seleccionada
    const handleMesaSeleccionada = (mesaId) => {
        setMesaSeleccionada(mesaId);
        setNombreCliente(''); // Limpiar el nombre del cliente al cambiar de mesa
    };

    // Manejar cantidad del producto en el carrito
    const handleCantidadProducto = (productoId, accion) => {
        const carritoActual = { ...carrito };
        const productosMesa = carritoActual[mesaSeleccionada];

        const index = productosMesa.findIndex((item) => item.idproducto === productoId);
        if (index !== -1) {
            if (accion === 'incrementar') {
                productosMesa[index].cantidad += 1;
            } else if (accion === 'reducir') {
                productosMesa[index].cantidad -= 1;
                if (productosMesa[index].cantidad <= 0) {
                    productosMesa.splice(index, 1); // Eliminar producto si cantidad es 0
                }
            }

            carritoActual[mesaSeleccionada] = productosMesa;
            setCarrito(carritoActual);
        }
    };

    // Realizar pedido
    const handleRealizarPedido = async () => {
        if (!mesaSeleccionada || !carrito[mesaSeleccionada] || carrito[mesaSeleccionada].length === 0) {
            message.warning('No hay productos seleccionados para realizar el pedido.');
            return;
        }

        const pedido = {
            idmesa: mesaSeleccionada,
            nombreCliente: nombreCliente || 'Sin Nombre',
            productos: carrito[mesaSeleccionada],
            idempleado: localStorage.getItem('idEmpleado'), // Obtener el idEmpleado del localStorage
        };

        try {
            const response = await axios.post('http://localhost:3001/api/pedidoRoutes/realizarPedido', pedido);
            if (response.data.success) {
                message.success(response.data.message);
                setCarrito((prev) => ({ ...prev, [mesaSeleccionada]: [] })); // Limpiar el carrito de la mesa actual
                fetchProductos(categoriaActual); // Actualizar productos
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error('Error al realizar el pedido:', error);
            message.error('Hubo un error al realizar el pedido');
        }
    };

    // Calcular total
    const calcularTotal = () => {
        if (!carrito[mesaSeleccionada] || carrito[mesaSeleccionada].length === 0) return 0;
        return carrito[mesaSeleccionada].reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    useEffect(() => {
        fetchProductos('menu');
        fetchMesas();
    }, []);

    return (
        <div style={{ display: 'flex', padding: '20px' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
                <h1 style={{ textAlign: 'center' }}>Registro de Pedidos</h1>
                <Menu mode="horizontal" selectedKeys={[categoriaActual]} onClick={({ key }) => handleMenuClick(key)}>
                    <Menu.Item key="menu">Menú</Menu.Item>
                    <Menu.Item key="plato_carta">Platos Carta</Menu.Item>
                    <Menu.Item key="postres">Postres</Menu.Item>
                    <Menu.Item key="bebidas">Bebidas</Menu.Item>
                </Menu>

                <div
                    style={{
                        marginTop: '20px',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                    }}
                >
                    <Row gutter={[16, 16]}>
                        {productos.length > 0 ? (
                            productos.map((producto) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={producto.idproducto}>
                                    <Card
                                        hoverable
                                        cover={
                                            <img
                                                alt={producto.nombre}
                                                src={
                                                    producto.imagen_url.startsWith('/')
                                                        ? `http://localhost:3001${producto.imagen_url}`
                                                        : producto.imagen_url
                                                }
                                                style={{ height: '150px', objectFit: 'cover' }}
                                            />
                                        }
                                        onClick={() => handleProductoSeleccionado(producto)}
                                    >
                                        <Meta
                                            title={producto.nombre}
                                            description={
                                                <>
                                                    <p>Precio: S/. {producto.precio}</p>
                                                    <p>Cantidad disponible: {producto.stock}</p>
                                                </>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', width: '100%' }}>No hay productos disponibles</p>
                        )}
                    </Row>
                </div>
            </div>

            <div style={{ width: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h2 style={{ textAlign: 'center' }}>Pedido - Mesa {mesaSeleccionada}</h2>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px' }}>
                    {mesas.map((mesa) => (
                        <Button
                            key={mesa.idmesa}
                            type={mesaSeleccionada === mesa.idmesa ? 'primary' : 'default'}
                            onClick={() => handleMesaSeleccionada(mesa.idmesa)}
                        >
                            Mesa {mesa.numero_mesa}
                        </Button>
                    ))}
                </div>

                <Input
                    placeholder="Nombre del cliente"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    style={{ marginTop: '10px' }}
                />

                <div>
                    {carrito[mesaSeleccionada]?.length > 0 ? (
                        carrito[mesaSeleccionada].map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                    {item.nombre} - S/. {item.precio} x {item.cantidad}
                                </span>
                                <div>
                                    <Button size="small" onClick={() => handleCantidadProducto(item.idproducto, 'incrementar')}>
                                        +
                                    </Button>
                                    <Button
                                        size="small"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => handleCantidadProducto(item.idproducto, 'reducir')}
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay productos seleccionados</p>
                    )}
                </div>

                <h3 style={{ marginTop: '10px' }}>Total: S/. {calcularTotal()}</h3>

                <Button type="primary" block style={{ marginTop: '10px' }} onClick={handleRealizarPedido}>
                    Realizar Pedido
                </Button>
            </div>
        </div>
    );
}
