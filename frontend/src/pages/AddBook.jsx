import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Header from "../layout/Header";
import RateLimitedUI from "../components/RateLimitedUI";
import instance from "../lib/axios";

export default function AddBook() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState(""); /*male, female, both*/
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !title || !description || !section || !price) {
      toast.error("All fields are required");
      return;
    }

    if (!whatsapp && !telegram) {
      toast.error("Add WhatsApp or Telegram contact");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("section", section);
      formData.append("price", price);
      formData.append("whatsapp", whatsapp);
      formData.append("telegram", telegram);

      await instance.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Book added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error adding book:", error);
      if (error.response?.status === 429) {
        toast.error("slow down, too many requests.");
        setIsRateLimited(true);
        return;
      } else {
        toast.error("Failed to add book");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Header />
      {!loading && isRateLimited && <RateLimitedUI />}
      {!loading && !isRateLimited && (
        <div className="max-w-md mx-auto mt-8 p-6">
          <Toaster position="top-right" />
          <Link to={"/"} className="btn btn-ghost mb-6 flex">
            <ArrowLeftIcon className="size-5 mr-2" />
            Back to Notes
          </Link>
          <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-semibold">
                Upload an image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <label className="block mb-2 font-semibold">Section</label>
            <div className="flex gap-2">
              {["male", "female", "both"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSection(value)}
                  className={`px-4 py-2 rounded border font-medium ${
                    section === value
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">WhatsApp</label>
              <input
                type="text"
                placeholder="+966xxxxxxxxx"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Telegram</label>
              <input
                type="text"
                placeholder="@username"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading || isRateLimited}
              variant="primary"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
