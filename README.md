# Pet Adoption

## Configure Google sign-in

Create an Auth0 Single Page Application and an Auth0 API. Set the API identifier
to `https://api.pawfect.local` (or choose another identifier and use it
consistently below). Enable the Google social connection and enable only that
connection for the Pawfect application. The frontend explicitly requests the
`google-oauth2` connection; Auth0 creates a user on their first Google sign-in,
so registration and login use the same flow.

In the Auth0 application settings, allow these local URLs:

- Allowed Callback URL: `http://localhost:5173`
- Allowed Logout URL: `http://localhost:5173`
- Allowed Web Origin: `http://localhost:5173`

Copy `.env.example` to `.env.local` and fill in the Auth0 domain, application
client ID, and API audience. Do not put an Auth0 client secret in the frontend.

Set the backend's matching Auth0 issuer, JWKS endpoint, and API audience before
starting Spring Boot. For example, in PowerShell:

```powershell
$env:AUTH0_ISSUER_URI = "https://your-tenant.us.auth0.com/"
$env:AUTH0_JWKS_URI = "https://your-tenant.us.auth0.com/.well-known/jwks.json"
$env:AUTH0_AUDIENCE = "https://api.pawfect.local"
```

The issuer must end with `/`, and the audience must match both the Auth0 API
identifier and `VITE_AUTH0_AUDIENCE`. Adoption requests require a valid Auth0
access token with the configured issuer and audience. Other pet API operations
remain unchanged.

## Run the app

Start the Spring Boot pet API in one terminal:

```powershell
Set-Location backend\pet-adoption-backend
.\mvnw.cmd spring-boot:run
```

In a second terminal, start the frontend from the project root:

```powershell
npm run dev
```

The admin inventory, adoption page, and pet-card selector use the Spring Boot API at `http://localhost:8081/pets`. On startup, the backend imports the pets in `src/components/Admin/db.json` into H2 when the database is empty. The H2 database is in-memory, so it resets whenever Spring Boot stops and is seeded again from `db.json` the next time it starts.

To inspect H2 while Spring Boot is running, open `http://localhost:8081/h2-console` and use:

- JDBC URL: `jdbc:h2:mem:db`
- User name: `sa`
- Password: leave blank

`npm run server` starts a separate json-server on port 3000; it is not the API used by the app's pet pages.
