import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2";
import { authenticateUser, registerUser } from "../services/authService.js";

function Login() {
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isRegisterMode) {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setIsSubmitting(true);
      const result = await registerUser({
        email: form.email,
        password: form.password,
        name: form.name
      });
      setIsSubmitting(false);
      
      if (!result.success) {
        setError(result.error ?? "Registration failed. Please try again.");
        return;
      }
    } else {
      setIsSubmitting(true);
      const result = await authenticateUser({
        email: form.email,
        password: form.password
      });
      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error ?? "Unable to sign in. Please try again.");
        return;
      }
    }

    navigate("/dashboard");
  }

  function toggleMode() {
    setIsRegisterMode((prev) => !prev);
    setError("");
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-800 px-4">
      <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
        <svg className="h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path
            d="M0 200 H150 L180 100 L220 300 L260 150 L300 200 H800"
            stroke="#37B49D"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12h4l2-7 4 14 2-7h8"
                stroke="#37B49D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            {isRegisterMode ? "Create Account" : "Clinical Copilot"}
          </h1>
          <p className="mt-1.5 text-sm text-ink-300">
            {isRegisterMode 
              ? "Sign up to start organizing your medical records" 
              : "Sign in to access your health records and AI insights"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7">
          {isRegisterMode && (
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Full Name
              </label>
              <div className="relative mt-2">
                <HiOutlineUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-mist-300 bg-mist-50 py-2.5 pl-10 pr-3 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
                />
              </div>
            </div>
          )}

          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Email Address
          </label>
          <div className="relative mt-2">
            <HiOutlineEnvelope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-mist-300 bg-mist-50 py-2.5 pl-10 pr-3 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
            />
          </div>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Password
          </label>
          <div className="relative mt-2">
            <HiOutlineLockClosed className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full rounded-xl border border-mist-300 bg-mist-50 py-2.5 pl-10 pr-3 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
            />
          </div>

          {isRegisterMode && (
            <div className="mt-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Confirm Password
              </label>
              <div className="relative mt-2">
                <HiOutlineLockClosed className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-mist-300 bg-mist-50 py-2.5 pl-10 pr-3 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
                />
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-xs font-medium text-critical-400">{error}</p>}

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn-primary mt-6 w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>{isRegisterMode ? "Registering..." : "Signing in..."}</span>
              </>
            ) : (
              <span>{isRegisterMode ? "Register" : "Sign In"}</span>
            )}
          </button>

          <div className="mt-5 text-center text-xs text-ink-400">
            {isRegisterMode ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={toggleMode} className="text-teal-500 font-semibold hover:underline">
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button type="button" onClick={toggleMode} className="text-teal-500 font-semibold hover:underline">
                  Register
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
