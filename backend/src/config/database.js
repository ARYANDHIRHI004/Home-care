import mongoose from "mongoose";
import { env } from "../utils/env.js";
import logger from "../utils/logger.js";

import dns from "dns"

dns.setServers(['8.8.8.8', '8.8.4.4'])


const connectDB = async () => {
    try {
        logger.info("Connecting to database...");

        const mongodbConnectionInstance = await mongoose.connect(env.MONGO_URI);
        logger.info(`Database connected — host: ${mongodbConnectionInstance.connection.host}, database: ${mongodbConnectionInstance.connection.name}`);
        return mongodbConnectionInstance;
    } catch (err) {
        logger.error("Database connection failed:", err);
        process.exit(1);
    }
};


   



export default connectDB