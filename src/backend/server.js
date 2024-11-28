import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/userRouter.js';
import { serverLogger } from '../logging/logger.js';

const app = express();
const port = 3001;

app.use(
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cors(),
);

app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    serverLogger.debug('This is in the app.use function in server.js');
    serverLogger.error('Something went wrong:', err);
    res.status(err.status || 500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
    serverLogger.debug('This is in the app.listen function in server.js');
    console.log(`Server is running on http://localhost:${port}`);
    serverLogger.info(`Express server listening on port ${port} with pid ${process.pid}`);
});
