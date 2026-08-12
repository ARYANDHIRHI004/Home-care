import { ROLES } from "../enum/role.enum.js";

const normalizeRoles = (role) => {
  if (!role) return [];
  if (Array.isArray(role)) return role;
  return String(role)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  const userRoles = normalizeRoles(req.user?.role);

  if (userRoles.includes(ROLES.SUPER_ADMIN)) return next();

  const allowed = userRoles.some((role) => allowedRoles.includes(role));

  if (!allowed) {
    return res.status(403).json({ message: "Insufficient role" });
  }

  return next();
};
