const express = require('express');
const cors = require('cors');
const db = require('./dbConnection'); // Esto asegura que la BD se crea
const authRoutes = require('./authRoutes'); // Importa las rutas de autenticación
const registroRoutes = require('./registroRoutes');
const tipProdRoutes = require('./tipProdRoutes'); // Importa las rutas para tipos de producto
const registroProRoutes = require('./registroProRoutes');
const tipoProductosRoutes = require('./tipoProductosRoutes');
const mesaRoutes = require('./mesaRoutes');
const reporteRouter = require('./reporteRouter');
const pedidoRoutes = require('./pedidoRoutes');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(cors({ origin: '*' })); 
app.use(express.json());

// Usar rutas de autenticación
app.use('/', authRoutes);

app.use('/api', registroRoutes);

// Rutas para tipos de producto
app.use('/api/tipProdRoutes', tipProdRoutes);
app.use('/api/tiposdeproducto', tipoProductosRoutes);

// Rutas para productos
app.use('/api/registroProRoutes', registroProRoutes);

app.use( mesaRoutes);
app.use(reporteRouter);
app.use(pedidoRoutes);
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
