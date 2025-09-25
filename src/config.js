import { config } from "dotenv";
config();

export const serverConfig = {
    PORT: process.env.PORT,
    dbName: process.env.DB_NAME
}