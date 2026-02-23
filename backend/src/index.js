import express from "express";
import cors from "cors";
import booksRoutes from "./routes/booksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import rateLimit from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
        "connect-src": [
          "'self'",
          "http://localhost:5000",
          "http://localhost:5173",
          "ws://localhost:5173",
          "ws://localhost:5000",
        ],
        "default-src": ["'self'"],
      },
    },
  }),
);
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}
app.use(express.json());
app.use(rateLimit);
app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/files{/*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.use(errorHandler);

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  ),
);
