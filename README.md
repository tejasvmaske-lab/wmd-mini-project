# Pet Adoption

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
