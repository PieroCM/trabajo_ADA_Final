import React from 'react';
import './interfazPedido.css'; // Archivo de estilos (lo crearemos a continuación)

const InterfazPedido = () => {
    return (
        <div className="menu-container">
            <nav className="menu-bar">
                <ul className="menu-list">
                    <li className="menu-item">Menu</li>
                    <li className="menu-item">Platos Carta</li>
                    <li className="menu-item">Bebidas</li>
                    <li className="menu-item">Postres</li>
                </ul>
            </nav>
        </div>
    );
};

export default InterfazPedido;
