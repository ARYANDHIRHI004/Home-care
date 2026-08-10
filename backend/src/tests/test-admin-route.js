/**
 * Admin Route Test Script
 * 
 * Run this file using Node.js to test the admin authentication routes:
 * node test-admin-route.js
 * 
 * Make sure your backend server is running (`npm run dev`) before running this script.
 */

const BACKEND_URL = "http://localhost:8000";
const ADMIN_EMAIL = "homecarre2405@gmail.com";
const ADMIN_PASSWORD = "cleaningsolution2026";

async function testAdminRoutes() {
    console.log("🧪 Starting Admin Route Tests...\n");
    let sessionCookie = "";

    try {
        // ─── 1. Login Test ────────────────────────────────────────────────────────
        console.log("▶️ [TEST 1] POST /api/admin/auth/login");
        
        const loginRes = await fetch(`${BACKEND_URL}/api/admin/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
        });

        const loginData = await loginRes.json();
        console.log(`   Status: ${loginRes.status}`);
        
        if (!loginRes.ok) {
            console.error("   ❌ Login Failed:", loginData.message || loginData);
            return;
        }
        
        console.log("   ✅ Login Successful!");
        console.log("   User Data:", loginData.data?.user?.email);

        // Extract cookie for subsequent authenticated requests
        const setCookieHeader = loginRes.headers.get("set-cookie");
        if (setCookieHeader) {
            sessionCookie = setCookieHeader.split(";")[0]; 
            console.log("   ✅ Session Cookie received.");
        } else {
            console.error("   ❌ No Set-Cookie header found!");
            return;
        }
        console.log("--------------------------------------------------\n");


        // ─── 2. Get Profile Test ──────────────────────────────────────────────────
        console.log("▶️ [TEST 2] GET /api/admin/auth/me");
        
        const meRes = await fetch(`${BACKEND_URL}/api/admin/auth/me`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Cookie": sessionCookie
            },
        });

        const meData = await meRes.json();
        console.log(`   Status: ${meRes.status}`);
        
        if (meRes.ok && meData.success) {
            console.log("   ✅ Profile fetched successfully!");
            console.log("   Role:", meData.data?.role);
        } else {
            console.error("   ❌ Failed to fetch profile:", meData.message || meData);
        }
        console.log("--------------------------------------------------\n");


        // ─── 3. Logout Test ───────────────────────────────────────────────────────
        console.log("▶️ [TEST 3] POST /api/admin/auth/logout");
        
        const logoutRes = await fetch(`${BACKEND_URL}/api/admin/auth/logout`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Cookie": sessionCookie
            },
        });

        const logoutData = await logoutRes.json();
        console.log(`   Status: ${logoutRes.status}`);
        
        if (logoutRes.ok && logoutData.success) {
            console.log("   ✅ Logout successful!");
        } else {
            console.error("   ❌ Logout failed:", logoutData.message || logoutData);
        }
        console.log("--------------------------------------------------\n");


        // ─── 4. Get Profile After Logout (Should Fail) ────────────────────────────
        console.log("▶️ [TEST 4] GET /api/admin/auth/me (After Logout)");
        
        const meFailRes = await fetch(`${BACKEND_URL}/api/admin/auth/me`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Cookie": sessionCookie
            },
        });

        const meFailData = await meFailRes.json();
        console.log(`   Status: ${meFailRes.status} (Expected: 401)`);
        
        if (!meFailRes.ok) {
            console.log("   ✅ Profile fetch correctly blocked after logout!");
            console.log("   Message:", meFailData.message || meFailData);
        } else {
            console.error("   ❌ Security Issue: Able to fetch profile after logout!");
        }
        console.log("--------------------------------------------------\n");

        console.log("🎉 All API Tests Completed!");

    } catch (err) {
        console.error("❌ Network or Execution Error:", err.message);
        console.log("Make sure your backend is running (`npm run dev`)!");
    }
}

testAdminRoutes();
