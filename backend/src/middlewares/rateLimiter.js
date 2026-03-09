import ratelimit from "../config/upstash.js";

const rateLimit = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit(req.cookies.token || req.ip);

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default rateLimit;
