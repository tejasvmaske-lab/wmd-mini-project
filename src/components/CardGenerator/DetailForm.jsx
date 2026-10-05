import { useEffect, useState } from "react";
import { useCardContext } from "./CardContext";

const DetailForm = () => {
  const { addPet, selectDatabasePet } = useCardContext();
  const [databasePets, setDatabasePets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [databaseError, setDatabaseError] = useState("");

  useEffect(() => {
    const loadDatabasePets = async () => {
      try {
        const response = await fetch("http://localhost:8081/pets");

        if (!response.ok) {
          throw new Error("The saved pet list could not be loaded.");
        }

        setDatabasePets(await response.json());
        setDatabaseError("");
      } catch (error) {
        console.error("Error loading saved pets:", error);
        setDatabaseError("Saved pets could not be loaded. Please check that the Spring Boot server is running.");
      }
    };

    loadDatabasePets();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Pet name is required.";
    }

    if (!formData.species) {
      newErrors.species = "Please select a species.";
    }

    if (!formData.breed.trim()) {
      newErrors.breed = "Breed is required.";
    }

    if (!formData.age || formData.age <= 0) {
      newErrors.age = "Enter a valid age.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addPet(formData);

    setFormData({
      name: "",
      species: "",
      breed: "",
      age: "",
      gender: "",
      location: "",
    });

    setErrors({});
  };

  const handleDatabasePetSelect = (e) => {
    e.preventDefault();
    const selectedPet = databasePets.find(
      (pet) => String(pet.id) === selectedPetId,
    );

    if (selectedPet) {
      selectDatabasePet(selectedPet);
    }
  };

  return (
    <div className="card">
      <h2>Add Pet Details</h2>

      <form onSubmit={handleDatabasePetSelect}>
        <div className="form-group">
          <label htmlFor="savedPet">Quick select a saved pet</label>
          <select
            id="savedPet"
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
          >
            <option value="">Select a pet from the database</option>
            {databasePets.map((pet) => (
              <option key={pet.id} value={String(pet.id)}>
                {pet.petName} ({pet.petType})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn" disabled={!selectedPetId}>
          Generate Card from Selected Pet
        </button>
        {databaseError && (
          <span className="error" role="alert">
            {databaseError}
          </span>
        )}
      </form>

      <p className="manual-entry-label">Or enter pet details manually</p>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Pet Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className="error">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label>Species</label>
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
          >
            <option value="">Select Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>

          {errors.species && (
            <span className="error">{errors.species}</span>
          )}
        </div>

        <div className="form-group">
          <label>Breed</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />

          {errors.breed && (
            <span className="error">{errors.breed}</span>
          )}
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />

          {errors.age && (
            <span className="error">{errors.age}</span>
          )}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {errors.gender && (
            <span className="error">{errors.gender}</span>
          )}
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          {errors.location && (
            <span className="error">{errors.location}</span>
          )}
        </div>

        <button type="submit" className="btn">
          Generate Pet ID Card
        </button>

      </form>
    </div>
  );
};

export default DetailForm;