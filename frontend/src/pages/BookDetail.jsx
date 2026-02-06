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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to home
        </Link>

        {loading ? (
          <div className="animate-pulse max-w-4xl mx-auto bg-white rounded-xl p-8 shadow">
            <div className="h-64 bg-gray-200 rounded mb-6" />
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        ) : book ? (
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="flex justify-center items-start">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full max-w-sm rounded-lg shadow-md object-cover"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {book.title}
                </h1>

                <span className="inline-block w-fit mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                  {book.section}
                </span>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {book.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <p className="text-3xl font-bold text-green-600">
                    ${book.price}
                  </p>

                  <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Book not found.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
