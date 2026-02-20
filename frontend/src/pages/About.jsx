import Header from "../layout/Header";
import Footer from "../layout/Footer";
import NavBar from "../layout/NavBar";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NavBar />
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-3xl bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-4 text-green-600">
            About Uni Shop
          </h1>

          <p className="mb-4 text-gray-700 leading-relaxed">
            Welcome to the UPM Bookstore! We are dedicated to providing students
            and faculty with high-quality academic resources and books.
          </p>

          <p className="mb-4 text-gray-700 leading-relaxed">
            Our platform connects university students in a convenient
            marketplace where they can buy, sell, and discover textbooks at
            affordable prices. We aim to reduce costs and make education more
            accessible.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
