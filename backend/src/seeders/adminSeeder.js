/**
 * Admin Seeder
 * Creates the first admin user and sets their role to "admin".
 *
 * Usage (from backend directory):
 *   node src/seeders/adminSeeder.js
 */

// Fix DNS SRV resolution (same as database.js config)
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { auth, db } from "../utils/auth.js";

const ADMIN_EMAIL    = "homecarre2405@gmail.com";
const ADMIN_PASSWORD = "cleaningsolution2026";
const ADMIN_NAME     = "Super Admin";

async function seedAdmin() {
    console.log("🌱 Seeding admin user...");

    try {
        // ── Step 1: Create the user via Better Auth ────────────────────────────
        const response = await auth.api.signUpEmail({
            body: {
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                name: ADMIN_NAME,
            },
            asResponse: true,
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));

            const alreadyExists =
                err?.code === "USER_ALREADY_EXISTS" ||
                response.status === 422 ||
                response.status === 409;

            if (alreadyExists) {
                console.warn("⚠️  User already exists — will update role to admin.");
            } else {
                throw new Error(err?.message || `HTTP ${response.status}: ${JSON.stringify(err)}`);
            }
        } else {
            const data = await response.json();
            console.log(`✅ User created: ${data.user?.email} (id: ${data.user?.id})`);
        }

        // ── Step 2: Promote role to "admin" using the shared db connection ─────
        const result = await db.collection("user").updateOne(
            { email: ADMIN_EMAIL },
            { $set: { role: "admin", updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            console.error("❌ User not found in DB. Check that the email is correct.");
            process.exit(1);
        }

        console.log(`✅ Role set to "admin" for ${ADMIN_EMAIL}`);
        console.log("\n🎉 Admin seeded successfully!");
        console.log(`   Email   : ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);

    } catch (error) {
        console.error("❌ Seeder failed:", error.message);
        process.exit(1);
    }

    process.exit(0);
}

seedAdmin();
