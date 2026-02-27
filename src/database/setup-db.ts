import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

async function createDatabase() {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME;

    if (!database) {
        console.error('[] Error: DB_NAME is not defined in the environment variables.');
        process.exit(1);
    }

    // Conectar a MySQL sin seleccionar una base de datos todavía
    let connection;
    try {
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
        });
    } catch (err: any) {
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.warn(`[Setup DB] Acceso denegado con usuario '${user}'. Intentando con 'root' (con contraseña 'root')...`);
            connection = await mysql.createConnection({
                host,
                port,
                user: 'root',
                password: 'root',
            });
        } else {
            throw err;
        }
    }

    try {
        console.log(`[Setup DB] Checking if database "${database}" exists...`);
        // Crear la base de datos si no existe (evita errores si ya existe)
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        console.log(`[Setup DB] Database "${database}" is ready to use!`);
    } catch (error) {
        console.error(`[Setup DB] Error creating database:`, error);
    } finally {
        // Cerrar la conexión
        await connection.end();
    }
}

createDatabase();
