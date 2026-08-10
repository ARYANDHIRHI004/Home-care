import { auth } from "../utils/auth.js";
import ApiError from "../utils/apiError.js";


const adminAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session || !session.user) {
            return next(new ApiError(401, "Unauthorized: No active session."));
        }

        if (session.user.role !== "admin") {
            return next(new ApiError(403, "Forbidden: Admin access only."));
        }

        req.admin = session.user;
        req.session = session.session;

        next();
    } catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid or expired session."));
    }
};

export default adminAuth;