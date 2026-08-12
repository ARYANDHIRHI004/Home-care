import mongoose from "mongoose";
import { env } from "../utils/env.js";
<<<<<<< HEAD
import dns from "dns"

const connectDB = async () => {
=======


const connectDB = async () => {
    try {
        console.log("connecting to db ");
        

        const mongodbConnectionInstance = await mongoose.connect(env.MONGO_URI);
        console.log(`Database connected host: ${mongodbConnectionInstance.connection.host}`);
        return mongodbConnectionInstance;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
>>>>>>> 5ac41fc5309cd9b147f688222bba01fcd61f1c9a

    console.log(env.MONGO_URI);



    dns.setServers(['8.8.8.8', '8.8.4.4'])

    const connectDB = async () => {
        try {
            console.log("connecting to db ");


            const mongodbConnectionInstance = await mongoose.connect(env.MONGO_URI);
            console.log(`Database connected host: ${mongodbConnectionInstance.connection.host}`);
            return mongodbConnectionInstance;
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}


export default connectDB