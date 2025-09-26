import { config } from "dotenv";
import path from 'node:path'
config();

export const serverConfig = {
    PORT: process.env.PORT,
    dbName: process.env.DB_NAME,
    file: {
        avatar: {
            formats: ['image/png', 'image/jpg', 'image/jpeg'],
            size: 3
        }
    },
    publicPath: () => path.join(process.cwd(), 'public'),
    viewPath: () => path.join(process.cwd(), 'src', 'views'),
}