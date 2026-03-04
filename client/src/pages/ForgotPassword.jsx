import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/forgot-password", { email });
      setSuccess(
        response.data?.message ||
          "If the account exists, a password reset link has been sent."
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-indigo-900 to-violet-900 p-4">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-cyan-500/30">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 text-center">
          Forgot Password
        </h2>
        <p className="text-cyan-200/80 mt-2 text-center">
          Enter your registered email to receive a reset link.
        </p>

        {error && (
          <div className="mt-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cyan-200 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your registered email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-cyan-200/80 text-sm mt-6 text-center">
          Back to{" "}
          <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
