import express from "express";
import booksRoutes from "./routes/booksRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/books", booksRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
