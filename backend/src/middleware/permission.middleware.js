import { ROLE_PERMISSIONS } from "../constants/role-permissions.js";

const normalizeRoles = (role) => {
  if (!role) return [];
  if (Array.isArray(role)) return role;
  return String(role)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

export const requirePermission = (permission) => (req, res, next) => {
  const roles = normalizeRoles(req.user?.role);

  const allowed = roles.some((role) =>
    (ROLE_PERMISSIONS[role] || []).includes(permission)
  );

  if (!allowed) {
    return res.status(403).json({
      message: "You do not have permission to perform this action",
      permission,
    });
  }

  return next();
};
