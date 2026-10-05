import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cluster from 'cluster';
import { availableParallelism } from 'os';
import process from 'process';
dotenv.config();

import connectDB from './database.js';
import userRoutes from './routes/user_routes.js';
import aiRoutes from './routes/ai_routes.js';
import updateRoutes from './routes/update_routes.js';

const numCPUs = availableParallelism();
// console.log(numCPUs);

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
const allowedOrigins = [
  "https://sleekreview.vercel.app",
  "https://sleekreview-git-main-rajeevprajapat43-gmailcoms-projects.vercel.app"  // Vercel preview URL
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
app.use('/update', updateRoutes)
app.get('/ping', (req, res) => {
    res.send('Server is alive and running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {

//   const app = express();
//   connectDB();

//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
//   app.use(cors());
  
//   app.get('/', (req, res) => {
//     res.send('Hello World!');
//   });
//   app.use('/user', userRoutes)
//   app.use('/ai', aiRoutes)
//   app.use('/update', updateRoutes)

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }