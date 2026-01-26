import ratelimit from "../config/upstash.js";

const rateLimit = async (_, res, next) => {
  try {
    const { success } = await ratelimit.limit("global");

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    console.error("Rate limiting error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default rateLimit;
