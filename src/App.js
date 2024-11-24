
import './App.css';
import React from 'react';
//import InterfazPedido from './components/interfazPedido';
import Login from './components/Login';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import RegistroEmp from './components/registroEmp';
import Opciones from './components/opciones';
import MenuMant from './components/MenuMant';
import RegisterPro from './components/registroPro';
import RegisterMesa from './components/registroMesa';
import OpciRepo from './components/opciReportes'; 
import ReportesPedidos from './components/todoreporte';
import MantTipoProductos from './components/MantTipoProductos';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/opciones" element={<Opciones />} />
        <Route path="/registro" element={<RegistroEmp />} />
        <Route path="/mantenimiento"element={<MenuMant/>} />
        <Route path="/registro_producto"element={<RegisterPro/>} />
        <Route path="/registro_mesa"element={<RegisterMesa/>} />
        <Route path="/opciReportes" element={<OpciRepo />} /> 
        <Route path="/todoreporte" element={<ReportesPedidos/>} />
        <Route path="/mantenimiento_tipo_productos"element={<MantTipoProductos/>}/>
      </Routes>

    </Router>
  );
}

export default App;
