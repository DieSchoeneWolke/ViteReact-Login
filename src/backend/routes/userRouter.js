// routes/authRouter.js
import express from 'express';
import { registerUser, loginUser, logoutUser } from '../middleware/authService.js';
import { authLogger } from '../../logging/logger.js';

const router = express.Router();

// Middleware to log HTTP requests
router.use((req, res, next) => {
    authLogger.debug('This is in the router.use function in userRouter.js');
    authLogger.info(`${req.method} ${req.url}`);
    next();
});

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        authLogger.debug('This is in the router.post function for the /register endpoint in userRouter.js');
        const response = await registerUser(username, password);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(error.message === 'User already exists' ? 400 : 500).json({ message: error.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        authLogger.debug('This is in the router.post function for the /login endpoint in userRouter.js');
        const response = await loginUser(username, password);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    const { username } = req.body; // Get the username from the request body

    try {
        authLogger.debug('This is in the router.post function for the /logout endpoint in userRouter.js');
        await logoutUser(username); // Call the logoutUser function
        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        authLogger.error(`Error logging out user ${username}: ${error.message}`);
        return res.status(500).json({ message: 'Logout failed.', error: error.message });
    }
});

// Export the router as the default export
export default router;
