import { useCardContext } from "./CardContext";
const PetCard = () => {
  const { activePet } = useCardContext();
  return (
    <div className="card">
      <h2>Generated Pet ID Card</h2>
      {!activePet ? (
        <p className="placeholder">Fill out and submit the form to generate a Pet ID card.</p>
      ) : (
        <div className="pet-id-card">
          <div className="pet-icon">🐾</div>
          <div className="pet-card-body">
            <h2>{activePet.name}</h2>
            <p>
              <strong>Species:</strong> {activePet.species}
            </p>
            <p>
              <strong>Breed:</strong> {activePet.breed}
            </p>
            <p>
              <strong>Age:</strong> {activePet.age} years
            </p>
            <p>
              <strong>Gender:</strong> {activePet.gender}
            </p>
            <p>
              <strong>Location:</strong> {activePet.location}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default PetCard;