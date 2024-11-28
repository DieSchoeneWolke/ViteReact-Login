import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/userRouter.js';
import { serverLogger } from '../logging/logger.js';

const app = express();
const port = 3001;

app.use(
    cors(),
    express.json(),
    express.urlencoded({
      extended: true,
    }),
  );  

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use authentication routes
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    serverLogger.debug('This is in the app.use function in server.js');
    serverLogger.error('Something went wrong:', err);
    res.status(err.status || 500);
  });

// Start the server
app.listen(port, () => {
    serverLogger.debug('This is in the app.listen function in server.js');
    console.log(`Server is running on http://localhost:${port}`);
    serverLogger.info(`Express server listening on port ${port} with pid ${process.pid}`);
});
