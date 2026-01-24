import express from "express";
import booksRoutes from "./routes/booksRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

connectDB();

app.use(express.json());
app.use("/api/books", booksRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Books API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
