import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./AdoptionPage.css";

const PETS_API = "http://localhost:8081/pets";

function AdoptionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading, getAccessTokenSilently } = useAuth();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [adoptingPetId, setAdoptingPetId] = useState(null);

  const loadPets = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(PETS_API);
      if (!response.ok) {
        throw new Error("The available pets could not be loaded.");
      }

      setPets(await response.json());
    } catch (loadError) {
      console.error("Error loading available pets:", loadError);
      setError("Unable to load available pets. Please check that the Spring Boot server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const adoptPet = async (pet) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnTo: "/adopt" } });
      return;
    }

    if (!window.confirm(`Would you like to adopt ${pet.petName}?`)) {
      return;
    }

    setAdoptingPetId(pet.id);
    setError("");

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${PETS_API}/${pet.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Your sign-in could not be verified. Please sign out, sign back in, and try again."
            : "The pet could not be adopted.",
        );
      }

      setPets((currentPets) => currentPets.filter((currentPet) => currentPet.id !== pet.id));
    } catch (adoptError) {
      console.error("Error adopting pet:", adoptError);
      setError(
        adoptError instanceof Error
          ? adoptError.message
          : `Unable to adopt ${pet.petName}. Please try again.`,
      );
    } finally {
      setAdoptingPetId(null);
    }
  };

  return (
    <main className="adoption-page">
      <header className="adoption-heading">
        <span className="eyebrow">Meet your new best friend</span>
        <h1>Pets looking for a home</h1>
        <p>Browse the pets currently available at our adoption center.</p>
      </header>

      {error && <p className="adoption-message adoption-error" role="alert">{error}</p>}
      {isLoading ? (
        <p className="adoption-message" role="status">Loading available pets...</p>
      ) : pets.length === 0 ? (
        <p className="adoption-message">There are no pets available right now. Please check back soon.</p>
      ) : (
        <section className="adoption-pet-grid" aria-label="Available pets">
          {pets.map((pet) => (
            <article className="adoption-pet-card" key={pet.id}>
              {pet.imageURL ? (
                <img
                  className="adoption-pet-image"
                  src={pet.imageURL}
                  alt={pet.petName}
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                    event.currentTarget.nextElementSibling.hidden = false;
                  }}
                />
              ) : (
                <div className="adoption-pet-image-placeholder">
                  Image unavailable
                </div>
              )}
              {pet.imageURL && (
                <div className="adoption-pet-image-placeholder" hidden>
                  Image unavailable
                </div>
              )}
              <div className="adoption-pet-info">
                <h2>{pet.petName}</h2>
                <p><strong>Type:</strong> {pet.petType}</p>
                <p><strong>Age:</strong> {pet.age} months</p>
                <button
                  className="adoption-button"
                  type="button"
                  onClick={() => adoptPet(pet)}
                  disabled={isAuthLoading || adoptingPetId === pet.id}
                >
                  {isAuthLoading
                    ? "Checking sign-in..."
                    : adoptingPetId === pet.id
                      ? "Processing..."
                      : isAuthenticated
                        ? "Adopt"
                        : "Sign in to adopt"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdoptionPage;
