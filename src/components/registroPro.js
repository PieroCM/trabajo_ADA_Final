import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Table, message, Empty } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

export default function RegisterPro() {
    const [tipos, setTipos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form] = Form.useForm();

    // Obtener tipos de productos
    const fetchTipos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/tipProdRoutes/tipos');
            setTipos(response.data);
        } catch (error) {
            console.error('Error al cargar tipos de producto:', error);
            message.error('Error al cargar los tipos de producto');
        }
    };

    // Obtener lista de productos
    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/registroProRoutes/productos');
            setProductos(response.data);
            setFilteredProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            message.error('Error al cargar los productos');
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        setLoading(true);
        Promise.all([fetchTipos(), fetchProductos()]).finally(() => setLoading(false));
    }, []);

    // Guardar o actualizar producto
    const onFinish = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => formData.append(key, values[key]));
        if (fileList.length > 0) {
            formData.append('imagen', fileList[0].originFileObj);
        }

        try {
            const url = selectedProduct
                ? `http://localhost:3001/api/registroProRoutes/actualizarProducto`
                : `http://localhost:3001/api/registroProRoutes/guardarProducto`;

            const method = selectedProduct ? 'put' : 'post';
            if (selectedProduct) formData.append('idproducto', selectedProduct.idproducto);

            const response = await axios[method](url, formData);
            if (response.data.success) {
                message.success(selectedProduct ? 'Producto actualizado con éxito' : 'Producto guardado con éxito');
                form.resetFields();
                setFileList([]);
                setSelectedProduct(null);
                fetchProductos();
            } else {
                message.error(response.data.error || 'Error al guardar/actualizar el producto');
            }
        } catch (error) {
            console.error('Error al guardar/actualizar el producto:', error);
            message.error('Error al guardar/actualizar el producto');
        }
    };

    // Eliminar producto
    const handleDelete = async () => {
        if (!selectedProduct) return;

        try {
            const response = await axios.delete(`http://localhost:3001/api/registroProRoutes/eliminarProducto/${selectedProduct.idproducto}`);
            if (response.data.success) {
                message.success('Producto eliminado con éxito');
                setSelectedProduct(null);
                form.resetFields();
                setFileList([]);
                fetchProductos();
            } else {
                message.error(response.data.error || 'Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            message.error('Error al eliminar el producto');
        }
    };

    // Manejar el filtro de búsqueda
    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(searchTerm)
        );
        setFilteredProductos(filteredData);
    };

    // Manejar selección de fila
    const onRowSelect = (record) => {
        setSelectedProduct(record);
        form.setFieldsValue(record);
    };

    // Limpiar formulario
    const handleClear = () => {
        form.resetFields();
        setSelectedProduct(null);
        setFileList([]);
    };

    // Configuración de columnas de la tabla
    const columns = [
        { title: 'ID', dataIndex: 'idproducto', key: 'idproducto' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Precio', dataIndex: 'precio', key: 'precio' },
        { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
        { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
            <div style={{ width: '40%' }}>
                <h1 style={{ textAlign: 'center' }}>Registro de Producto</h1>
                <Form form={form} name="registro_producto" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="idtipoproducto"
                        label="Tipo de Producto"
                        rules={[{ required: true, message: 'Por favor, seleccione el tipo de producto' }]}
                    >
                        <Select placeholder="Seleccione un tipo" loading={loading}>
                            {tipos.map((tipo) => (
                                <Option key={tipo.idtipoproducto} value={tipo.idtipoproducto}>
                                    {tipo.nombre}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="nombre" label="Nombre del Producto" rules={[{ required: true }]}>
                        <Input placeholder="Nombre del Producto" />
                    </Form.Item>
                    <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
                        <Input placeholder="Precio" />
                    </Form.Item>
                    <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
                        <Input placeholder="Cantidad" />
                    </Form.Item>
                    <Form.Item name="imagen" label="Imagen del Producto">
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={(info) => setFileList(info.fileList)}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                        </Upload>
                    </Form.Item>

                    {/* Botones de acciones */}
                    {!selectedProduct && (
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Guardar Producto
                        </Button>
                    )}
                    {selectedProduct && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
                                Actualizar Producto
                            </Button>
                            <Button danger onClick={handleDelete} style={{ flex: 1 }}>
                                Eliminar Producto
                            </Button>
                        </div>
                    )}
                    <Button onClick={handleClear} style={{ marginTop: '10px', width: '100%' }}>
                        Limpiar
                    </Button>
                </Form>
            </div>
            <div style={{ width: '55%' }}>
                <h2>Lista de Productos</h2>
                <Input placeholder="Buscar productos..." onChange={handleSearch} style={{ marginBottom: '10px' }} />
                {filteredProductos.length > 0 ? (
                    <Table
                        dataSource={filteredProductos}
                        columns={columns}
                        rowKey="idproducto"
                        onRow={(record) => ({
                            onClick: () => onRowSelect(record),
                        })}
                    />
                ) : (
                    <Empty description="No hay datos que coincidan con la búsqueda" />
                )}
            </div>
        </div>
    );
}

