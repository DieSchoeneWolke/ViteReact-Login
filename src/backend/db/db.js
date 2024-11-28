import mysql from 'mysql2/promise';
import { databaseLogger } from '../../logging/logger.js';
import '../middleware/dotenv.js';

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    connectTimeout: 60,
    connectionLimit: 10,
};

export async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(config);
        databaseLogger.debug('This is in the connectToDatabase function in db.js');
        databaseLogger.info('Database connection established successfully.');
        return connection;
    } catch (error) {
        databaseLogger.error('Error connecting to the database:', error);
        throw error;
    }
}