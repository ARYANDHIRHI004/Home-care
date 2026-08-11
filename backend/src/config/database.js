/import mongoose from "mongoose";
import { env } from "../utils/env.js";
<<<<<<< HEAD
le

const connectDB = async () => {
    try {LE
        console.log(env.MONGO_URI);
=======
import dns from "dns"

dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {
    try {
        console.log("connecting to db ");
        
>>>>>>> 26791b39d37a3eab07797c757096b3dcf580e1af
        const mongodbConnectionInstance = await mongoose.connect(env.MONGO_URI);
        console.log(`Database connected host: ${mongodbConnectionInstance.connection.host}`);
        return mongodbConnectionInstance;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;