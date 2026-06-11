import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import connectDB from './database.js';
import userRoutes from './routes/user_routes.js';
import aiRoutes from './routes/ai_routes.js';

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/user', userRoutes)
app.use('/ai', aiRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});