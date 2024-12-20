// services/authService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../db/db.js';
import { authLogger } from '../../logging/logger.js';
import './dotenv.js';

const JWT_SECRET = process.env.JWT_SECRET; // Read JWT secret from environment variable
const JWT_EXPIRATION = '15m'; // Short-lived access token (15 minutes)
const REFRESH_TOKEN_EXPIRATION = '7d'; // Refresh token expiration (7 days)

export const registerUser = async (username, password) => {
    const connection = await connectToDatabase();

    try {
        authLogger.debug('This is in the registerUser function in authService.js');
        const [rows] = await connection.execute('SELECT * FROM credentials WHERE username = ?', [username]);
        if (rows.length > 0) {
            authLogger.warn(`Registration attempt failed: User ${username} already exists.`);
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('INSERT INTO credentials (username, password) VALUES (?, ?)', [username, hashedPassword]);
        authLogger.info(`User registered successfully: ${username}`);
        return { message: 'User registered successfully' };
    } catch (error) {
        authLogger.error(`Error registering user ${username}: ${error.message}`);
        throw error;
    } finally {
        await connection.end();
    }
};

export const loginUser = async (username, password) => {
    const connection = await connectToDatabase();

    try {
        const [rows] = await connection.execute('SELECT * FROM credentials WHERE username = ?', [username]);
        if (rows.length === 0) {
            authLogger.warn(`Login attempt failed: Invalid credentials for user ${username}.`);
            throw new Error('Invalid credentials');
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            authLogger.warn(`Login attempt failed: Invalid password for user ${username}.`);
            throw new Error('Invalid credentials');
        }

        // Generate access token
        const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        // Generate refresh token
        const refreshToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

        // Store access token in the database
        await connection.execute('INSERT INTO access_tokens (username, token) VALUES (?, ?)', [username, accessToken]);

        // Store refresh token in the database
        await connection.execute('INSERT INTO refresh_tokens (username, token) VALUES (?, ?)', [username, refreshToken]);
        authLogger.debug('This is in the loginUser function in authService.js');
        authLogger.info(`User logged in successfully: ${username}`);
        return { accessToken, refreshToken };
    } catch (error) {
        authLogger.debug('This is in the loginUser function in authService.js');
        authLogger.error(`Error logging in user ${username}: ${error.message}`);
        throw error;
    } finally {
        await connection.end();
    }
};

export const refreshAccessToken = async (refreshToken) => {
    const connection = await connectToDatabase();

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const username = decoded.username;

        // Check if the refresh token exists in the database
        const [rows] = await connection.execute('SELECT * FROM refresh_tokens WHERE username = ? AND token = ?', [username, refreshToken]);
        if (rows.length === 0) {
            throw new Error('Invalid refresh token');
        }

        // Generate a new access token
        const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Update the access token in the database
        await connection.execute('UPDATE access_tokens SET token = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?', [accessToken, username]);

        return { accessToken };
    } catch (error) {
        authLogger.debug('This is in the refreshAccessToken function in authService.js');
        authLogger.error(`Error refreshing access token: ${error.message}`);
        throw error;
    } finally {
        await connection.end();
    }
};

export const logoutUser = async (username) => {
    const connection = await connectToDatabase();

    try {
        // Remove the access token from the database
        await connection.execute('DELETE FROM access_tokens WHERE username = ?', [username]);
        // Remove the refresh token from the database
        await connection.execute('DELETE FROM refresh_tokens WHERE username = ?', [username]);
        authLogger.debug('This is in the logoutUser function in authService.js');
        authLogger.info(`User ${username} logged out successfully, tokens invalidated.`);
    } catch (error) {
        authLogger.debug('This is in the logoutUser function in authService.js');
        authLogger.error(`Error deleting tokens for user ${username}`);
        throw error;
    } finally {
        await connection.end();
    }
};