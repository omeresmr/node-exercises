import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res, next) => {
  res.json({ message: 'API Läuft!' });
});

export default app;
