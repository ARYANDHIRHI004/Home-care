import { auth } from "../../utils/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";
import { sendSuccess } from "../../utils/response.js";

export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body);
    

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const response = await auth.api.signInEmail({
        body: { email, password },
        asResponse: true,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new ApiError(401, errorBody?.message || "Invalid email or password.");
    }

    const data = await response.json();

    if (data?.user?.role !== "admin") {
        throw new ApiError(403, "Forbidden: This account does not have admin privileges.");
    }

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
        res.setHeader("Set-Cookie", setCookie);
    }

    return sendSuccess(res, {
        user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            image: data.user.image ?? null,
            createdAt: data.user.createdAt,
        },
        token: data.token ?? null,
    }, 200);
});

export const adminLogout = asyncHandler(async (req, res) => {
    const response = await auth.api.signOut({
        headers: req.headers,
        asResponse: true,
    });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
        res.setHeader("Set-Cookie", setCookie);
    }
    return sendSuccess(res, null, 200);
});

export const getAdminProfile = asyncHandler(async (req, res) => {
    return sendSuccess(res, {
        id: req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        image: req.admin.image ?? null,
        createdAt: req.admin.createdAt,
    }, 200);
});