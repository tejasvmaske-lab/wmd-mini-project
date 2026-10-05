import { useState } from "react";
import { useCardContext } from "./CardContext";

const DetailForm = () => {
  const { addPet } = useCardContext();

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

  return (
    <div className="card">
      <h2>Add Pet Details</h2>

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