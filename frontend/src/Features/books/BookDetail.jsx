import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import instance from "../../lib/axios";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded mb-6" />
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Book not found</p>
          <Link
            to="/"
            className="text-green-600 hover:underline mt-4 inline-block"
          >
            Back to home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to home
        </Link>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <img
                src={book.image}
                alt={book.title}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div className="flex flex-col h-full">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {book.title}
                </h1>

                <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full mb-4">
                  {book.section}
                </span>

                <p className="text-gray-600 mb-6">{book.description}</p>
              </div>

              <div className="mt-auto">
                <p className="text-3xl font-bold text-green-600 mb-4">
                  ${book.price}
                </p>

                {book.whatsapp && book.whatsapp !== 0 && (
                  <a
                    href={`https://wa.me/${book.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition mb-3"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    Contact on WhatsApp
                  </a>
                )}

                {book.telegram && (
                  <a
                    href={`https://t.me/${book.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    Contact on Telegram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
