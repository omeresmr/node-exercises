import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/projects.routes.js';
import taskRoutes from './routes/tasks.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.get('/', (req, res, next) => {
  res.json({ message: 'API is running!' });
});

export default app;
