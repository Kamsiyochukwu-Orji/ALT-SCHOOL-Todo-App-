import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Seo } from "../shared/Seo";

export default function LoginPage() {
  const { isAuthenticated, isLoadingAuth, loginWithEmail } = useAuth();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/todos";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoadingAuth && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginWithEmail(email.trim(), password);
    } catch (loginError) {
      setError(loginError?.response?.data?.message ?? loginError?.message ?? "Could not sign in with those credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <Seo title="Login" description="Sign in with your email and password to access your tasks." />
      <article className="card auth-card">
        <h1>Login</h1>
        <p className="state-card__subtle">Use your account email and password.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="form__input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <label className="form__label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="form__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          {error ? (
            <p className="form__error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="button button--primary" disabled={isSubmitting || isLoadingAuth}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="state-card__subtle">
          Need an account? <Link to="/signup">Create one</Link>
        </p>
      </article>
    </section>
  );
}
