import { auth } from "../lib/auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.auth = session;
    req.user = session.user;
    req.session = session.session;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired session",
      error: error.message,
    });
  }
};
