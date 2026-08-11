import { auth } from "../../utils/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";

export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

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

    return res.status(200).json(
        new ApiResponse(200, "Admin logged in successfully.", {
            user: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                image: data.user.image ?? null,
                createdAt: data.user.createdAt,
            },
            token: data.token ?? null,
        })
    );
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
    return res.status(200).json(
        new ApiResponse(200, "Admin logged out successfully.", null)
    );
});

export const getAdminProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "Admin profile fetched.", {
            id: req.admin.id,
            name: req.admin.name,
            email: req.admin.email,
            role: req.admin.role,
            image: req.admin.image ?? null,
            createdAt: req.admin.createdAt,
        })
    );
});