import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Modal, message } from 'antd';
import axios from 'axios';

export default function RegisterMesa() {
    const [form] = Form.useForm();
    const [mesas, setMesas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar mesas al montar el componente
    useEffect(() => {
        fetchMesas();
    }, []);

    // Obtener lista de mesas
    const fetchMesas = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/mesa');
            setMesas(response.data.data || []);
        } catch (error) {
            message.error('Error al cargar las mesas');
            console.error('Error:', error);
        }
        setLoading(false);
    };

    // Manejar el envío del formulario
    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (editingId) {
                // Actualizar mesa existente
                await axios.put(`http://localhost:3001/api/mesa/${editingId}`, values);
                message.success('Mesa actualizada exitosamente');
            } else {
                // Crear nueva mesa
                const response = await axios.post('http://localhost:3001/api/mesa', values);
                if (response.data.success) {
                    message.success('Mesa registrada exitosamente');
                }
            }
            setModalVisible(false);
            form.resetFields();
            fetchMesas();
            setEditingId(null);
        } catch (error) {
            message.error('Error al procesar la solicitud');
            console.error('Error:', error);
        }
        setLoading(false);
    };

    // Eliminar mesa
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/mesa/${id}`);
            message.success('Mesa eliminada exitosamente');
            fetchMesas();
        } catch (error) {
            message.error('Error al eliminar la mesa');
            console.error('Error:', error);
        }
    };

    // Editar mesa
    const handleEdit = (record) => {
        setEditingId(record.idmesa);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    // Columnas para la tabla
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
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <span>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Editar
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() =>
                            Modal.confirm({
                                title: '¿Está seguro de eliminar esta mesa?',
                                onOk: () => handleDelete(record.idmesa),
                            })
                        }
                    >
                        Eliminar
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Gestión de Mesas</h1>
                <Button
                    type="primary"
                    onClick={() => {
                        setEditingId(null);
                        form.resetFields();
                        setModalVisible(true);
                    }}
                >
                    Nueva Mesa
                </Button>
            </div>

            <Table columns={columns} dataSource={mesas} rowKey="idmesa" loading={loading} />

            <Modal
                title={editingId ? 'Editar Mesa' : 'Nueva Mesa'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="numero_mesa"
                        label="Número de Mesa"
                        rules={[{ required: true, message: 'Por favor, ingrese el número de mesa' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                            {editingId ? 'Actualizar' : 'Guardar'}
                        </Button>
                        <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
