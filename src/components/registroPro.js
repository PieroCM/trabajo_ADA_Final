import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Table, message, Empty } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

export default function RegisterPro() {
    const [tipos, setTipos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    // Cargar tipos de producto al cargar el componente
    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/tipProdRoutes/tipos');
                setTipos(response.data);
            } catch (error) {
                console.error('Error al cargar tipos de producto:', error);
                message.error('Error al cargar los tipos de producto');
            }
        };

        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/registroProRoutes/productos');
                setProductos(response.data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                message.error('Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchTipos();
        fetchProductos();
    }, []);

    // Manejar el envío del formulario
    const onFinish = async (values) => {
        const formData = new FormData();
        for (const key in values) {
            formData.append(key, values[key]);
        }
        if (fileList.length > 0) {
            formData.append('imagen', fileList[0].originFileObj);
        }

        // Mostrar los datos en consola antes de enviarlos
        console.log('Datos enviados al backend:', {
            idtipoproducto: values.idtipoproducto,
            nombre: values.nombre,
            precio: values.precio,
            cantidad: values.cantidad,
            imagen: fileList.length > 0 ? fileList[0].name : null,
        });

        try {
            const response = await axios.post('http://localhost:3001/api/registroProRoutes/guardarProducto', formData);
            if (response.data.success) {
                message.success('Producto guardado con éxito');
                form.resetFields();
                setFileList([]);
                setProductos([...productos, response.data.producto]); // Agregar el producto nuevo
            } else {
                message.error('Error al guardar el producto');
            }
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            message.error('Error al guardar el producto');
        }
    };

    // Manejar la subida de imágenes
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            message.success('Imagen cargada con éxito');
        }
    };

    // Columnas para la tabla
    const columns = [
        {
            title: 'ID',
            dataIndex: 'idproducto',
            key: 'idproducto',
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
            <div style={{ width: '40%' }}>
                <h1 style={{ textAlign: 'center' }}>Registro de Producto</h1>
                <Form
                    form={form}
                    name="registro_producto"
                    onFinish={onFinish}
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

                    <Form.Item
                        name="nombre"
                        label="Nombre del Producto"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese el nombre del producto',
                            },
                        ]}
                    >
                        <Input placeholder="Nombre del Producto" />
                    </Form.Item>

                    <Form.Item
                        name="precio"
                        label="Precio"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese el precio',
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Precio" />
                    </Form.Item>

                    <Form.Item
                        name="cantidad"
                        label="Cantidad"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese la cantidad',
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Cantidad" />
                    </Form.Item>

                    <Form.Item
                        name="imagen"
                        label="Imagen del Producto"
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleUploadChange}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Guardar Producto
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div style={{ width: '55%' }}>
                <h2>Lista de Productos</h2>
                {productos.length > 0 ? (
                    <Table
                        dataSource={productos}
                        columns={columns}
                        rowKey={(record) => record.idproducto}
                        loading={loading}
                    />
                ) : (
                    <Empty description="No hay datos en la tabla Productos" />
                )}
            </div>
        </div>
    );
}
