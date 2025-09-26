import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { serverConfig } from './config.js';
import { mainRouter } from './routes/main.routes.js';
const { PORT, dbName, publicPath, viewPath } = serverConfig;

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
})); 

app.use(express.json());
app.use(express.static(publicPath()));
app.use(express.static(viewPath()));
app.use(cookieParser());
app.use('/api', mainRouter)


async function bootstrap(){
    try {
        await mongoose.connect(process.env.dbUri, {
            dbName,
            serverSelectionTimeoutMS: 5000
        });
        app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT} link`))
    } catch (error) {
        console.log('MongoDB connection error', error);
        
    }
} 
bootstrap();


