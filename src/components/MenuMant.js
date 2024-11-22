import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function MenuMant() {
    const navigate = useNavigate(); // Hook para manejar la navegación

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1 style={{ marginBottom: '20px' }}>Mantenimiento</h1>
            <Button
                type="primary"
                style={{ marginBottom: '10px', width: '200px' }}
                onClick={() => navigate('/registro_producto')} // Navegación al hacer clic
            >
                Mantenimiento Producto
            </Button>
            <Button
                type="primary"
                style={{ marginBottom: '10px', width: '200px' }}
                onClick={() => navigate('/registro_mesa')} // Navegación al hacer clic
            >
                Mantenimiento Mesa
            </Button>
            <Button
                type="default"
                style={{ marginTop: '20px', width: '200px' }}
                onClick={() => navigate('/opciones')} // Navegación al hacer clic en "Salir"
            >
                Salir
            </Button>
        </div>
    );
}
