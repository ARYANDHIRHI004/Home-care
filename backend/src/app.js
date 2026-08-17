import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth, db } from "./utils/auth.js";
import cors from "cors";
import adminAuthRouter from "./routes/adminAuth.routes.js";
import apiRouter from "./routes/index.js";
import logger from "./utils/logger.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Every request gets one line logged on response finish (not on receipt) so
// the real status code and duration are known — `res.on("finish")` fires
// even for responses the route handler sends directly via res.send/res.json,
// unlike wrapping res.end which some handlers bypass.
app.use((req, res, next) => {
    const startedAt = process.hrtime.bigint();
    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
        const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
        logger[level](`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`);
    });
    next();
});

app.post("/api/auth/{*any}", toNodeHandler(auth));
app.get("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());


app.use("/api/admin", adminAuthRouter);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// ─── Dev-only: seed admin user ───────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
    app.post("/api/dev/seed-admin", async (req, res) => {
        try {
            const { email, password, name } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "email and password required" });
            }

            // Create user via Better Auth (ignores if already exists)
            const signUpRes = await auth.api.signUpEmail({
                body: { email, password, name: name || "Admin" },
                asResponse: true,
            });

            const alreadyExists = signUpRes.status === 422 || signUpRes.status === 409;
            if (!signUpRes.ok && !alreadyExists) {
                const err = await signUpRes.json().catch(() => ({}));
                return res.status(400).json({ success: false, message: err?.message || "Sign-up failed" });
            }

            // Promote to admin directly using the live DB connection
            const result = await db.collection("user").updateOne(
                { email },
                { $set: { role: "admin", updatedAt: new Date() } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "User not found in DB" });
            }

            return res.status(200).json({
                success: true,
                message: `Admin seeded: ${email}`,
                modified: result.modifiedCount > 0,
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    });
}



app.use((err, req, res, _next) => {
    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";
    logger.error(`${req.method} ${req.originalUrl} unhandled error:`, err);
    res.status(status).json({ success: false, status, message });
});

export default app;
