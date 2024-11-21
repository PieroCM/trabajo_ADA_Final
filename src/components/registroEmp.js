import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios'; // Importar Axios para realizar solicitudes HTTP
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

export default function RegistroEmp() {
    const navigate = useNavigate(); // Hook para redireccionar a otras páginas

    const onFinish = async (values) => {
        const { nombre, apellido, sexo, edad, usuario, contraseña } = values;

        try {
            // Realiza una solicitud POST al servidor para registrar un nuevo empleado y usuario
            const response = await axios.post('http://localhost:3001/api/registroEmpleado', { nombre, apellido, sexo, edad, usuario, contraseña });
            console.log(response)
            if (response.data.success) {
                alert('Registro exitoso');
                navigate('/'); // Redirige al login después del registro
            } else {
                alert('Error al registrar. Intente nuevamente.');
            }
        } catch (error) {
            console.error('Error al intentar registrar:', error);
            alert('Error de conexión con el servidor.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 400 }}>
                <h1 style={{ textAlign: 'center' }}>Registro de Empleado</h1>
                <Form
                    name="registro_empleado"
                    className="registro-form"
                    initialValues={{
                        sexo: 'M',
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="nombre"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese el nombre',
                            },
                        ]}
                    >
                        <Input placeholder="Nombre" />
                    </Form.Item>

                    <Form.Item
                        name="apellido"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese el apellido',
                            },
                        ]}
                    >
                        <Input placeholder="Apellido" />
                    </Form.Item>

                    <Form.Item
                        name="sexo"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, seleccione el sexo',
                            },
                        ]}
                    >
                        <Select placeholder="Seleccione el sexo">
                            <Option value="M">Masculino</Option>
                            <Option value="F">Femenino</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="edad"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese la edad (debe ser mayor o igual a 18)',
                                validator: (_, value) =>
                                    value && Number(value) >= 18
                                        ? Promise.resolve()
                                        : Promise.reject('La edad debe ser mayor o igual a 18'),
                            },
                        ]}
                    >
                        <Input placeholder="Edad" />
                    </Form.Item>

                    <Form.Item
                        name="usuario"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese el usuario',
                            },
                        ]}
                    >
                        <Input placeholder="Usuario" />
                    </Form.Item>

                    <Form.Item
                        name="contraseña"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese la contraseña',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Contraseña" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="registro-form-button">
                            Registrarse
                        </Button>
                        <Button
                            type="link"
                            onClick={() => navigate('/')}
                            style={{ marginLeft: '10px' }}
                        >
                            Regresar al Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
