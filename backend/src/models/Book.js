import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: { type: String },
    description: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      enum: ["male", "female", "both"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    telegram: {
      type: String,
      trim: true,
    },
    sold: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
