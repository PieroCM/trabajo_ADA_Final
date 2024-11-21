import React, { useState, useEffect } from 'react';
import { Form, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

export default function RegisterPro() {
    const [tipos, setTipos] = useState([]);

    // Cargar tipos de producto al cargar el componente
    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/tipProdRoutes/tipos');
                setTipos(response.data); // Establece los tipos obtenidos de la BD
            } catch (error) {
                console.error('Error al cargar tipos de producto:', error);
                message.error('Error al cargar los tipos de producto');
            }
        };

        fetchTipos(); // Llama a la función para cargar los tipos
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: 400 }}>
                <h1 style={{ textAlign: 'center' }}>Registro de Producto</h1>
                <Form
                    name="registro_producto"
                    layout="vertical"
                >
                    <Form.Item
                        name="idtipoproducto"
                        label="Tipo de Producto"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, seleccione el tipo de producto',
                            },
                        ]}
                    >
                        <Select placeholder="Seleccione un tipo">
                            {tipos.map((tipo) => (
                                <Option key={tipo.idtipoproducto} value={tipo.idtipoproducto}>
                                    {tipo.nombre}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
