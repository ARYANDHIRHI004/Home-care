import app from "./app.js";
import connectDB from "./config/database.js";
import { env } from "./utils/env.js";

const PORT = env.PORT;

connectDB()
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});