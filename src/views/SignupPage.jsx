import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Seo } from "../shared/Seo";

export default function SignupPage() {
  const { isAuthenticated, isLoadingAuth, signupWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoadingAuth && isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signupWithEmail(email.trim(), password, name.trim());
    } catch (signupError) {
      setError(signupError?.response?.data?.message ?? signupError?.message ?? "Could not create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <Seo title="Sign up" description="Create an account with email and password." />
      <article className="card auth-card">
        <h1>Create account</h1>
        <p className="state-card__subtle">Sign up with your name, email, and password.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label" htmlFor="signup-name">
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            className="form__input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
          <label className="form__label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            className="form__input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <label className="form__label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            className="form__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          <label className="form__label" htmlFor="signup-confirm-password">
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            className="form__input"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          {error ? (
            <p className="form__error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="button button--primary" disabled={isSubmitting || isLoadingAuth}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="state-card__subtle">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </article>
    </section>
  );
}
