import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import testRoutes from './src/routes/testRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import applicationRoute from './src/routes/applicationRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('API running'));

app.use('/api/auth', authRoutes);

app.use('/api/test', testRoutes);


app.use('/api/jobs', jobRoutes);

app.use('/api/applications', applicationRoute);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
