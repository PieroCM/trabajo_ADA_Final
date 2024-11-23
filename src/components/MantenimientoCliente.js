import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Modal, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate

const MantenimientoClientes = () => {
  const [form] = Form.useForm();
  const [clientes, setClientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Inicializar el hook useNavigate

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Obtener lista de clientes
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/clientes');
      setClientes(response.data);
    } catch (error) {
      message.error('Error al cargar los clientes');
      console.error('Error:', error);
    }
  };

  // Manejar el envío del formulario
  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editingId) {
        // Actualizar cliente existente
        await axios.put(`http://localhost:3001/api/clientes/${editingId}`, values);
        message.success('Cliente actualizado exitosamente');
      } else {
        // Crear nuevo cliente
        await axios.post('http://localhost:3001/api/clientes', values);
        message.success('Cliente registrado exitosamente');
      }
      setModalVisible(false);
      form.resetFields();
      fetchClientes();
      setEditingId(null);
    } catch (error) {
      message.error('Error al procesar la solicitud');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // Eliminar cliente
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/clientes/${id}`);
      message.success('Cliente eliminado exitosamente');
      fetchClientes();
    } catch (error) {
      message.error('Error al eliminar el cliente');
      console.error('Error:', error);
    }
  };

  // Editar cliente
  const handleEdit = (record) => {
    setEditingId(record.idcliente);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // Columnas para la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'idcliente',
      key: 'idcliente',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
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
            onClick={() => Modal.confirm({
              title: '¿Está seguro de eliminar este cliente?',
              onOk: () => handleDelete(record.idcliente)
            })}
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
        <h1>Mantenimiento de Clientes</h1>
        <Button type="primary" onClick={() => {
          setEditingId(null);
          form.resetFields();
          setModalVisible(true);
        }}>
          Nuevo Cliente
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={clientes} 
        rowKey="idcliente"
        loading={loading}
      />

      <Modal
        title={editingId ? "Editar Cliente" : "Nuevo Cliente"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[{ required: true, message: 'Por favor ingrese el teléfono' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              {editingId ? 'Actualizar' : 'Guardar'}
            </Button>
            <Button onClick={() => setModalVisible(false)}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Button 
        type="default" 
        style={{ marginTop: '20px' }} 
        onClick={() => navigate(-1)} // Volver a la pestaña anterior
      >
        Volver
      </Button>
    </div>
  );
};

export default MantenimientoClientes;
