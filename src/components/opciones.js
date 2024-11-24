import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Opciones() {
    const navigate = useNavigate(); // Hook para manejar la navegación

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1 style={{ marginBottom: '20px' }}>Opciones</h1>
            <Button
                type="primary"
                style={{ marginBottom: '10px', width: '200px' }}
                onClick={() => navigate('/tomarPedido')} // Navegación al hacer clic
            >
                Tomar Pedido
            </Button>
            <Button
                type="primary"
                style={{ marginBottom: '10px', width: '200px' }}
                onClick={() => navigate('/mantenimiento')} // Navegación al hacer clic
            >
                Mantenimiento
            </Button>
            <Button
                type="primary"
                style={{ marginBottom: '10px', width: '200px' }}
                onClick={() => navigate('/opciReportes')} // Navegación al hacer clic
            >
                Generar reportes
            </Button>
            <Button
                type="default"
                style={{ marginTop: '20px', width: '200px' }}
                onClick={() => navigate('/')} // Navegación al hacer clic en "Salir"
            >
                Salir
            </Button>
        </div>
    );
}
