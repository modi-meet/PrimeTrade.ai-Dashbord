import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT) || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('PrimeTrade API is running');
});

// Start server with database connection
const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, '0.0.0.0', () => {
            console.log(`[server]: Server running on port ${port}`);
        });
    } catch (err) {
        console.error('Startup failed:', err);
        process.exit(1);
    }
};

startServer();
