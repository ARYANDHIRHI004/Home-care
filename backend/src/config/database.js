import mongoose from "mongoose";
import { env } from "../utils/env";

const connectDB = async () => {
    try {
        const mongodbConnectionInstance = await mongoose.connect(env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database connected host: ${mongodbConnectionInstance.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;