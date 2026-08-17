import { auth } from "../utils/auth.js";

// Same session lookup as requireAuth, but never rejects — populates
// req.user/req.session when a valid session cookie is present, leaves them
// undefined otherwise. For routes a public visitor and an authenticated
// admin both hit (e.g. GET /api/faqs), where the response should differ by
// role rather than be blocked outright for one side.
export const optionalAuth = async (req, _res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user) {
      req.auth = session;
      req.user = session.user;
      req.session = session.session;
    }
  } catch {
    // Invalid/expired session on an optional route just means "treat as anonymous"
  }
  return next();
};

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
