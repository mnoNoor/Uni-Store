import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../layout/Header";
import AddBookButton from "../layout/AddBookButton";
import NavBar from "../layout/NavBar";
import ProductCard from "../layout/BookCard";
import RateLimitedUI from "../components/RateLimitedUI";
import Footer from "../layout/Footer";

export default function Home() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        setBooks(res.data);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
          return;
        } else {
          console.error("Error fetching books:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);
  return (
    <div>
      <Header />
      <NavBar />
      <AddBookButton />
      {loading && <p className="p-4 flex justify-center">Loading books...</p>}
      {!loading && isRateLimited && <RateLimitedUI />}
      {!loading && !isRateLimited && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {books.map((book) => (
            <ProductCard key={book._id} book={book} setBooks={setBooks} />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
