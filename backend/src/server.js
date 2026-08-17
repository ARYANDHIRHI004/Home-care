import app from "./app.js";
import connectDB from "./config/database.js";
import { env } from "./utils/env.js";
import logger from "./utils/logger.js";

const PORT = env.PORT;

connectDB();
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});