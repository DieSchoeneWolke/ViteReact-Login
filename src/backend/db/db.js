import mysql from "mysql2/promise";
import { databaseLogger } from "../../logging/logger.js";
import "../middleware/dotenv.js";

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  connectTimeout: 60000,
  connectionLimit: 10,
};

export const pool = mysql.createPool(config);

export async function connectToDatabase() {
  try {
    const connection = await pool.getConnection();
    databaseLogger.debug("This is in the connectToDatabase function in db.js");
    databaseLogger.info("Database connection established successfully.");
    return connection;
  } catch (error) {
    databaseLogger.error("Error connecting to the database:", error);
    throw error;
  }
}
