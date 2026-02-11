import { expressjwt } from "express-jwt";

export const jwtAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
}).unless({
  path: [
    { url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"] },
    { url: "/api/auth/register", methods: ["POST"] },
    { url: "/api/auth/login", methods: ["POST"] },
    { url: "/api/auth/verify-email", methods: ["POST"] },
    { url: "/api/auth/forgot-password", methods: ["POST"] },
    { url: "/api/auth/reset-password", methods: ["POST"] },
    { url: "/api/auth/resend-otp", methods: ["POST"] },
  ],
});

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // No token / not authenticated
    if (!req.auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // If roles are specified, check them
    if (allowedRoles.length > 0) {
      if (!allowedRoles.includes(req.auth.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    next();
  };
}

