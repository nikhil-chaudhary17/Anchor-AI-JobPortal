import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await login(form);

      if (data.user.role === "candidate") {
        navigate("/candidate/dashboard");
      } else if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.message ||
        "Login failed. Check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-2">

      {/* Brand Panel */}
      <div className="relative hidden overflow-hidden bg-navy p-12 text-paper md:flex md:flex-col md:justify-between">

        {/* Decorative shapes */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-mint/5 blur-3xl"
        />

        <Link
          to="/"
          className="relative z-10 w-fit font-['Space_Grotesk'] text-xl font-semibold tracking-tight transition-colors hover:text-amber"
        >
          Anchor
        </Link>

        <div className="relative z-10 max-w-md">

          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Sparkles size={20} className="text-amber" />
          </div>

          <p className="font-['Space_Grotesk'] text-3xl font-medium leading-tight">
            Find opportunities that actually make sense for you.
          </p>

          <p className="mt-5 text-sm leading-6 text-paper/50">
            Your skills. Your experience. Your next opportunity.
            Anchor brings them together.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Personalized job matching",
              "Track your applications",
              "Build a stronger career profile",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-paper/60"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber/10">
                  <Check size={12} className="text-amber" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-[#7A81A0]">
          © {new Date().getFullYear()} Anchor
        </p>
      </div>

      {/* Form Panel */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">

          {/* Back */}
          <Link
            to="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-[#5B6178] transition-colors hover:text-navy"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to home
          </Link>

          {/* Heading */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              Welcome back
            </p>

            <h1 className="font-['Space_Grotesk'] text-3xl font-semibold tracking-tight text-navy">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#5B6178]">
              Log in to see your matches and application status.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="text-sm font-medium text-navy">
                Email
              </label>

              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 placeholder:text-navy/30 focus:border-amber focus:ring-4 focus:ring-amber/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-navy">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-navy/55 transition-colors hover:text-amber"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 placeholder:text-navy/30 focus:border-amber focus:ring-4 focus:ring-amber/10"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-navy py-3 text-sm font-semibold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-[#5B6178]">
            New to Anchor?{" "}
            <Link
              to="/register"
              className="font-semibold text-navy transition-colors hover:text-amber"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
