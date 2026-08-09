import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.post("/api/auth/{*any}", toNodeHandler(auth));
app.get("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());



app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;
