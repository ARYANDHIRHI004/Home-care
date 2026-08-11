/import mongoose from "mongoose";
import { env } from "../utils/env.js";
le

const connectDB = async () => {
    try {LE
        console.log(env.MONGO_URI);
        const mongodbConnectionInstance = await mongoose.connect(env.MONGO_URI);
        console.log(`Database connected host: ${mongodbConnectionInstance.connection.host}`);
        return mongodbConnectionInstance;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;