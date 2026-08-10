import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});

export const env = {
    PORT: process.env.PORT ?? 5000,
    MONGO_URI: process.env.MONGO_URI,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET

}