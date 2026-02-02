import Header from "../layout/Header";
import NavBar from "../layout/NavBar";
import instance from "../lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader } from "lucide-react";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post("/auth", {
        email,
        password,
      });
      toast.success("Login successful!");
      navigate("/AddBook");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <NavBar />
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Log in</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="relative">Email:</label>
            <Mail className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="relative">Password:</label>
            <Lock className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full pl-8"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {loading ? (
                <Loader className="animate-spin mx-auto text-center" />
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
