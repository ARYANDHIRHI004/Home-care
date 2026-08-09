import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});

export const env = {
    PORT: process.env.PORT ?? 3000,
    MONGO_URI: process.env.MONGO_URI,
}