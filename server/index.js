const express = require('express');
const cors = require('cors');
const db = require('./dbConnection'); // Esto asegura que la BD se crea
const authRoutes = require('./authRoutes'); // Importa las rutas de autenticación
const registroRoutes = require('./registroRoutes');
const tipProdRoutes = require('./tipProdRoutes'); // Importa las rutas para tipos de producto
const registroProRoutes = require('./registroProRoutes');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Usar rutas de autenticación
app.use('/', authRoutes);

app.use('/', registroRoutes);

// Rutas para tipos de producto
app.use('/api/tipProdRoutes', tipProdRoutes);

// Rutas para productos
app.use('/api/registroProRoutes', registroProRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
