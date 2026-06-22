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
// app.use(cors());
const allowedOrigins = [
  "https://sleekreview.vercel.app/",
  "https://sleekreview-git-main-rajeevprajapat43-gmailcoms-projects.vercel.app/"  // Vercel preview URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/user', userRoutes)
app.use('/ai', aiRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});