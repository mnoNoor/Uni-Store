// SignUp.jsx
import Header from "../layout/Header";
import NavBar from "../layout/NavBar";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, username);
      toast.success("Sign up successful!");
      navigate("/add-book");
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error(err.message || "Sign up failed!");
    }
  };

  return (
    <div>
      <Header />
      <NavBar />
      {isLoading && <Loader className="animate-spin mx-auto text-center" />}
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label>User Name:</label>
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full"
              type="text"
              name="userName"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="block mt-2">Password:</label>
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <span className="text-red-500">{error}</span>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto text-center" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
