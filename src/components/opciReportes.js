import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function OpciRepo() {
    const navigate = useNavigate(); // Hook para manejar la navegación

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1 style={{ marginBottom: '20px' }}>Opciones de Reportes de Pedidos</h1>
            <Button
                type="primary"
                style={{ marginBottom: '10px', width: '250px' }}
                onClick={() => navigate('/todoreporte')} // Navegación para reportes de todos los pedidos
            >
                Generar Reporte de Todos los Pedidos
            </Button>
            <Button
                type="default"
                style={{ marginTop: '20px', width: '250px' }}
                onClick={() => navigate(-1)} // Navegación para salir
            >
                Salir
            </Button>
        </div>
    );
}
