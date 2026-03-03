import jwt from "jsonwebtoken";

/* ===========================
   AUTH GUARD
   =========================== */
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    // console.log("Authorization:", req.headers.authorization);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // attach minimal identity
    req.user = {
      userId: decoded.userId,
    };
// console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
