import { config } from "dotenv";
config();

export const serverConfig = {
    PORT: process.env.PORT,
    dbName: process.env.DB_NAME,
    file: {
        avatar: {
            formats: ['image/png', 'image/jpg', 'image/jpeg'],
            size: 3
        }
    }
}