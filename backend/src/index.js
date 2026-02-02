import express from "express";
import cors from "cors";
import booksRoutes from "./routes/booksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import rateLimit from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(rateLimit);
app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Welcome to the Books API");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  ),
);
