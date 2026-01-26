import express from "express";
import booksRoutes from "./routes/booksRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimit from "./middlewares/rateLimiter.js";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(rateLimit);
app.use("/api/books", booksRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Books API");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  ),
);
