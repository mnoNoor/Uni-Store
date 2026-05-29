import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch {
    /* ignore invalid token */
  }
  next();
};
