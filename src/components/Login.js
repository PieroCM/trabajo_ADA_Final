import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { username, password } = values;

        try {
            const response = await axios.post('http://localhost:3001/validatePassword', { username, password });

            if (response.data.validation) {
                alert('Inicio de sesión exitoso');
                localStorage.setItem('idEmpleado', response.data.user.idempleado);
                navigate('/opciones');
            } else {
                alert('Usuario o contraseña incorrectos. Intente de nuevo.');
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            alert('Error de conexión con el servidor.');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Ocupa toda la pantalla
                flexDirection: 'column',
            }}
        >
            <div style={{ width: 400, background: 'rgba(255, 255, 255, 0.8)', padding: 20, borderRadius: 10 }}>
                <h1 style={{ textAlign: 'center', color: 'black', fontWeight: 'bold' }}>Login</h1>
                <Form name="normal_login" className="login-form" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingresa el username',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, ingrese la contraseña',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                            Inicio sesión
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <span>Or </span>
                        <button
                            type="button"
                            onClick={() => navigate('/registro')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'blue',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                        >
                            Registrate ahora
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
