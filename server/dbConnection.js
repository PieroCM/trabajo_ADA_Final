const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos SQLite3
const db = new sqlite3.Database('./pedidos.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite3');
        createTables();
    }
});

// Función para crear las tablas
function createTables() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS mesas (
                idmesa INTEGER PRIMARY KEY AUTOINCREMENT,
                numero_mesa INTEGER NOT NULL
            )
        `);

        // Crear tabla de Clientes
        db.run(`
            CREATE TABLE IF NOT EXISTS clientes (
                idcliente INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                telefono TEXT
            )
        `);

        // Crear tabla de Productos
        db.run(`
            CREATE TABLE IF NOT EXISTS productos (
                idproducto INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                precio REAL NOT NULL,
                idtipoproducto INTEGER,
                imagen_url TEXT,
                FOREIGN KEY (idtipoproducto) REFERENCES tiposdeproducto(idtipoproducto)
            )
        `);
        
        db.run(`
            CREATE TABLE IF NOT EXISTS STOCK (
                idproducto INTEGER PRIMARY KEY,
                cantidad INTEGER NOT NULL,
                FOREIGN KEY (idproducto) REFERENCES productos(idproducto)
            )
        `);

        // Crear tabla de Tipos de Producto
        db.run(`
            CREATE TABLE IF NOT EXISTS tiposdeproducto (
                idtipoproducto INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL
            )
        `);

        // Crear tabla de Pedidos
        db.run(`
            CREATE TABLE IF NOT EXISTS pedidos (
                idpedido INTEGER PRIMARY KEY AUTOINCREMENT,
                idmesa INTEGER,
                idcliente INTEGER,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estado TEXT NOT NULL,
                idempleado INTEGER,
                FOREIGN KEY (idmesa) REFERENCES mesas(idmesa),
                FOREIGN KEY (idcliente) REFERENCES clientes(idcliente),
                FOREIGN KEY (idempleado) REFERENCES empleados(idempleado)
            )
        `);

        // Crear tabla de Detalle de Pedidos
        db.run(`
            CREATE TABLE IF NOT EXISTS detallepedidos (
                iddetallepedido INTEGER PRIMARY KEY AUTOINCREMENT,
                idpedido INTEGER,
                idproducto INTEGER,
                cantidad INTEGER NOT NULL,
                FOREIGN KEY (idpedido) REFERENCES pedidos(idpedido),
                FOREIGN KEY (idproducto) REFERENCES productos(idproducto)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS empleados (
                idempleado INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                sexo TEXT CHECK (sexo IN ('M', 'F')) NOT NULL,
                edad INTEGER CHECK (edad > 0)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                idusuario INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT NOT NULL UNIQUE,
                contraseña TEXT NOT NULL,
                idempleado INTEGER UNIQUE,
                FOREIGN KEY (idempleado) REFERENCES empleados(idempleado)
            )
        `);

        // Aquí puedes incluir las otras tablas si las necesitas

        console.log('Tablas creadas exitosamente (si no existían).');
    });
}

module.exports = db;

