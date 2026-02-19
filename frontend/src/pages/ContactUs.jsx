import Header from "../layout/Header";
import Footer from "../layout/Footer";
import NavBar from "../layout/NavBar";

export default function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <NavBar />
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold m-4">Contact Us</h1>
        <p className="mb-2">
          If you have any questions, feedback, or inquiries, please feel free to
          reach out to us. We value your input and are here to assist you.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Email:{" "}
            <a
              href="mailto:zcbmq14@gmail.com"
              className="text-blue-600 hover:underline"
            >
              zcbmq14@gmail.com
            </a>
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}
