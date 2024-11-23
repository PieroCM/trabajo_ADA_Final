import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Modal, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MantenimientoTiposProductos = () => {
  const [form] = Form.useForm();
  const [tipos, setTipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tiposdeproducto');
      setTipos(response.data);
    } catch (error) {
      message.error('Error al cargar los tipos de producto');
      console.error('Error:', error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Datos enviados al servidor:', values); // LOG FRONTEND
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/tiposdeproducto/${editingId}`, values);
        message.success('Tipo de producto actualizado exitosamente');
      } else {
        await axios.post('http://localhost:3001/api/tiposdeproducto', values);
        message.success('Tipo de producto registrado exitosamente');
      }
      setModalVisible(false);
      form.resetFields();
      fetchTipos();
      setEditingId(null);
    } catch (error) {
      message.error('Error al procesar la solicitud');
      console.error('Error:', error);
    }
    setLoading(false);
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tiposdeproducto/${id}`);
      message.success('Tipo de producto eliminado exitosamente');
      fetchTipos();
    } catch (error) {
      message.error('Error al eliminar el tipo de producto');
      console.error('Error:', error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.idtipoproducto);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idtipoproducto',
      key: 'idtipoproducto',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
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
                title: '¿Está seguro de eliminar este tipo de producto?',
                onOk: () => handleDelete(record.idtipoproducto),
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
        <h1>Mantenimiento de Tipos de Productos</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Nuevo Tipo de Producto
        </Button>
      </div>

      <Table columns={columns} dataSource={tipos} rowKey="idtipoproducto" loading={loading} />

      <Modal
        title={editingId ? 'Editar Tipo de Producto' : 'Nuevo Tipo de Producto'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
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

      <Button type="default" style={{ marginTop: '20px' }} onClick={() => navigate(-1)}>
        Volver
      </Button>
    </div>
  );
};

export default MantenimientoTiposProductos;
