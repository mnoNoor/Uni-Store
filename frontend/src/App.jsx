import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";

import "./lib/i18n";
import { useDirection } from "./lib/i18nDir";

import Layout from "./Features/layout/Layout";
import Home from "./Features/pages/Home";
import AddBook from "./Features/books/AddBook";
import BookDetails from "./Features/books/BookDetail";
import EditPage from "./Features/books/EditPage";
import LogIn from "./Features/auth/LogIn";
import SignUp from "./Features/auth/SignUp";
import UserPage from "./Features/user/UserPage";
import ContactUs from "./Features/pages/ContactUs";
import About from "./Features/pages/About";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useDirection();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
