import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./AuthPage.css";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname === "/register";
  const { isConfigured, isLoading, isAuthenticated, loginWithRedirect } = useAuth();
  const [error, setError] = useState("");
  const returnTo = location.state?.returnTo;
  const destination =
    typeof returnTo === "string" && returnTo.startsWith("/")
      ? returnTo
      : "/adopt";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [destination, isAuthenticated, isLoading, navigate]);

  const signInWithGoogle = async () => {
    if (!isConfigured || !loginWithRedirect) {
      return;
    }

    setError("");
    try {
      await loginWithRedirect({
        appState: { returnTo: destination },
        authorizationParams: { connection: "google-oauth2" },
      });
    } catch (loginError) {
      console.error("Unable to start Google sign-in:", loginError);
      setError("Google sign-in could not be started. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <span className="eyebrow">A loving home starts here</span>
        <h1 id="auth-title">{isRegisterPage ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-description">
          Sign in securely with Google to continue to pet adoption.
          New here? Your account is created automatically the first time you continue.
        </p>

        {!isConfigured && (
          <p className="auth-message auth-error" role="alert">
            Sign-in is not configured yet. Add the Auth0 settings from the setup
            instructions to your <code>.env.local</code> file and restart the app.
          </p>
        )}
        {error && <p className="auth-message auth-error" role="alert">{error}</p>}

        <button
          className="google-sign-in"
          type="button"
          onClick={signInWithGoogle}
          disabled={!isConfigured || isLoading}
        >
          <GoogleMark />
          Continue with Google
        </button>
        <p className="auth-terms">
          By continuing, you confirm that you have permission to use this Google account.
        </p>
        <p className="auth-switch">
          {isRegisterPage ? "Already registered?" : "New to Pawfect?"}{" "}
          <Link
            to={isRegisterPage ? "/login" : "/register"}
            state={{ returnTo: destination }}
          >
            {isRegisterPage ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="google-mark">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.73 6C44.43 38.07 46.98 31.89 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.54 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

export default AuthPage;
