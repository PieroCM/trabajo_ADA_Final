import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message } from 'antd';
import './menu.css';


const { Meta } = Card;


const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);


    // Cargar las categorías desde el backend
    useEffect(() => {
        fetch('http://localhost:3001/menu/categories')
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
                if (data.length > 0) {
                    setActiveCategory(data[0].idtipoproducto); // Seleccionar la primera categoría por defecto
                }
            })
            .catch((error) => {
                console.error('Error al obtener categorías:', error);
                message.error('Error al cargar las categorías');
            });
    }, []);


    // Cargar los productos desde el backend
    useEffect(() => {
        if (activeCategory !== null) {
            fetch('http://localhost:3001/menu/products')
                .then((response) => response.json())
                .then((data) => {
                    const filteredProducts = data.filter((product) => product.idtipoproducto === activeCategory);
                    setProducts(filteredProducts);
                })
                .catch((error) => {
                    console.error('Error al obtener productos:', error);
                    message.error('Error al cargar los productos');
                });
        }
    }, [activeCategory]);


    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Menú de Productos</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                {categories.map((category) => (
                    <button
                        key={category.idtipoproducto}
                        className={`category-tab ${activeCategory === category.idtipoproducto ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.idtipoproducto)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            backgroundColor: activeCategory === category.idtipoproducto ? '#1890ff' : '#fff',
                            color: activeCategory === category.idtipoproducto ? '#fff' : '#000',
                        }}
                    >
                        {category.nombre}
                    </button>
                ))}
            </div>
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
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.idproducto}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={product.nombre}
                                            src={
                                                product.imagen_url.startsWith('/')
                                                    ? `http://localhost:3001${product.imagen_url}`
                                                    : product.imagen_url
                                            }
                                            style={{ height: '150px', objectFit: 'cover' }}
                                        />
                                    }
                                >
                                    <Meta
                                        title={product.nombre}
                                        description={
                                            <>
                                                <p>Precio: S/ {product.precio}</p>
                                                <p>Stock: {product.cantidad}</p>
                                            </>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', width: '100%' }}>No hay productos disponibles para esta categoría.</p>
                    )}
                </Row>
            </div>
        </div>
    );
};


export default Menu;