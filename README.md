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

Spring Boot reads the Auth0 domain and API audience from the same `.env.local`
file when started from `backend\pet-adoption-backend`; no separate environment
variable setup is required. The domain must be the tenant host without
`https://` (for example, `your-tenant.us.auth0.com`), and the audience must
match the Auth0 API identifier. Adoption requests require a valid Auth0 access
token with the configured issuer and audience. Other pet API operations remain
unchanged.

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

The admin inventory, adoption page, and pet-card selector use the Spring Boot API at `http://localhost:8081/pets`. On startup, the backend imports the pets in `src/components/Admin/db.json` into H2 when the database is empty. Successful adoptions are saved in the `ADOPTED_PETS` H2 table with the pet details, adopter's Auth0 user ID, email when included in the access token, and adoption time. The available pet is removed only after its adoption record is saved. The H2 database is in-memory, so it resets whenever Spring Boot stops and is seeded again from `db.json` the next time it starts.

Admins add pets by selecting an image file (up to 5 MB) in the dashboard; when editing a pet, its current photo is kept unless a replacement is selected. The image is stored with the pet record and displayed throughout the app.

To inspect H2 while Spring Boot is running, open `http://localhost:8081/h2-console` and use:

- JDBC URL: `jdbc:h2:mem:db`
- User name: `sa`
- Password: leave blank

To view adoption history in the H2 console, run:

```sql
SELECT PET_NAME, PET_TYPE, AGE, ADOPTER_ID, ADOPTER_EMAIL, ADOPTED_AT
FROM ADOPTED_PETS
ORDER BY ADOPTED_AT DESC;
```

`npm run server` starts a separate json-server on port 3000; it is not the API used by the app's pet pages.
