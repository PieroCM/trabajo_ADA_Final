import React, { useState, useEffect } from 'react';
import './menu.css';

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    // Cargar las categorías desde el backend
    useEffect(() => {
        fetch('http://localhost:3001/menu/categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                if (data.length > 0) {
                    setActiveCategory(data[0].idtipoproducto); // Seleccionar la primera categoría por defecto
                }
            })
            .catch(error => console.error('Error al obtener categorías:', error));
    }, []);

    // Cargar los productos desde el backend
    useEffect(() => {
        if (activeCategory !== null) {
            fetch('http://localhost:3001/menu/products')
                .then(response => response.json())
                .then(data => {
                    const filteredProducts = data.filter(product => product.idtipoproducto === activeCategory);
                    setProducts(filteredProducts);
                })
                .catch(error => console.error('Error al obtener productos:', error));
        }
    }, [activeCategory]);

    return (
        <div className="menu-container">
            <h1>Menú de Productos</h1>
            <div className="categories-bar">
                {categories.map(category => (
                    <button
                        key={category.idtipoproducto}
                        className={`category-tab ${activeCategory === category.idtipoproducto ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.idtipoproducto)}
                    >
                        {category.nombre}
                    </button>
                ))}
            </div>
            <div className="products-container">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.idproducto} className="product-card">
                            <img
                                src={product.imagen_url || '/placeholder.jpg'}
                                alt={product.nombre}
                                className="product-image"
                            />
                            <h2>{product.nombre}</h2>
                            <p>Precio: S/ {product.precio}</p>
                            <p>Stock: {product.cantidad}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-products">No hay productos disponibles para esta categoría.</p>
                )}
            </div>
            <button className="back-button" onClick={() => window.history.back()}>
                Volver
            </button>
        </div>
    );
};

export default Menu;
