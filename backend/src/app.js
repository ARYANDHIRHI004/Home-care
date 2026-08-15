import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth, db } from "./utils/auth.js";
import cors from "cors";
import adminAuthRouter from "./routes/adminAuth.routes.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


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
    res.status(status).json({ success: false, status, message });
});

export default app;
