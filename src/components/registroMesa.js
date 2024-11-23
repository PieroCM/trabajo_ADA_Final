import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, message, Empty } from 'antd';
import axios from 'axios';

export default function RegisterMesa() {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    // Cargar mesas al cargar el componente
    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/registroMesaRouter/mesas');
                console.log('Respuesta al cargar mesas:', response.data);
                setMesas(response.data.data); // Accede correctamente a los datos
            } catch (error) {
                console.error('Error al cargar las mesas:', error);
                message.error('Error al cargar las mesas');
            } finally {
                setLoading(false);
            }
        };
        

        fetchMesas();
    }, []);

    // Manejar el envío del formulario
    const onFinish = async (values) => {
        console.log('Valores enviados al backend:', values); // Verifica los valores enviados

        try {
            const response = await axios.post('http://localhost:3001/api/registroMesaRouter/guardarMesa', values);
            console.log('Respuesta al guardar mesa:', response.data); // Verifica la respuesta del servidor

            if (response.data.success) {
                message.success('Mesa registrada con éxito');
                form.resetFields();
                // Verifica si el objeto 'mesa' está presente en la respuesta
                if (response.data.mesa) {
                    setMesas(prevMesas => [...prevMesas, response.data.mesa]); // Agregar la nueva mesa
                } else {
                    message.error('La respuesta del servidor no contiene la nueva mesa.');
                }
            } else {
                console.error('Error en la respuesta del servidor:', response.data); // Agregar más detalles
                message.error('Error al registrar la mesa');
            }
        } catch (error) {
            console.error('Error al registrar la mesa:', error.response || error); // Mostrar más detalles del error
            message.error('Error al registrar la mesa');
        }
    };

    // Columnas para la tabla (eliminamos "ubicación")
    const columns = [
        {
            title: 'ID',
            dataIndex: 'idmesa',
            key: 'idmesa',
        },
        {
            title: 'Número de Mesa',
            dataIndex: 'numero_mesa',
            key: 'numero_mesa',
        },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
            <div style={{ width: '40%' }}>
                <h1 style={{ textAlign: 'center' }}>Registro de Mesa</h1>
                <Form
                    form={form}
                    name="registro_mesa"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="numero_mesa"
                        label="Número de Mesa"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese el número de mesa',
                            },
                        ]}
                    >
                        <Input placeholder="Número de Mesa" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Registrar Mesa
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div style={{ width: '55%' }}>
                <h2>Lista de Mesas</h2>
                {mesas.length > 0 ? (
                    <Table
                        dataSource={mesas}
                        columns={columns}
                        rowKey={(record) => record.idmesa}
                        loading={loading}
                    />
                ) : (
                    <Empty description="No hay datos en la tabla de Mesas" />
                )}
            </div>
        </div>
    );
}
