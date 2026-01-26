import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import instance from "../lib/axios";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function BookDetails() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await instance.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grow container mx-auto p-4">
        <Link
          to="/"
          className="flex items-center text-blue-500 hover:underline mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
        {loading ? (
          <p>Loading book details...</p>
        ) : book ? (
          <div className="w-auto mx-auto bg-white p-6 rounded-lg shadow-md">
            <img
              src={book.image}
              alt={book.title}
              className="max-h-64 object-cover mb-4 rounded"
            />
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-700 mb-4">{book.description}</p>
            <p className="text-green-600 font-semibold text-xl">
              ${book.price}
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Buy Now
            </button>
          </div>
        ) : (
          <p>Book not found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
