import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { AuthContext, defaultAuth } from "./AuthContext.jsx";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const isConfigured = Boolean(domain && clientId && audience);

function Auth0Session({ children }) {
  const auth = useAuth0();

  return (
    <AuthContext.Provider value={{ ...auth, isConfigured: true }}>
      {children}
    </AuthContext.Provider>
  );
}

function Auth0ProviderWithRouter({ children }) {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        connection: "google-oauth2",
        scope: "openid profile email",
        ...(audience ? { audience } : {}),
      }}
      onRedirectCallback={(appState) => {
        const returnTo = appState?.returnTo;
        navigate(
          typeof returnTo === "string" && returnTo.startsWith("/")
            ? returnTo
            : "/",
          { replace: true },
        );
      }}
    >
      <Auth0Session>{children}</Auth0Session>
    </Auth0Provider>
  );
}

export function AuthProvider({ children }) {
  if (!isConfigured) {
    return (
      <AuthContext.Provider value={defaultAuth}>
        {children}
      </AuthContext.Provider>
    );
  }

  return <Auth0ProviderWithRouter>{children}</Auth0ProviderWithRouter>;
}
