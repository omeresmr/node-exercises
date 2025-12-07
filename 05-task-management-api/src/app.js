import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/projects.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.get('/', (req, res, next) => {
  res.json({ message: 'API is running!' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: fail,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export default app;
