import { createContext, useContext, useState } from "react";

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [activePet, setActivePet] = useState(null);

  const addPet = (newPet) => {
    const pet = {
      ...newPet,
      id: `PET-${String(pets.length + 1).padStart(3, "0")}`,
    };

    setPets((prevPets) => [...prevPets, pet]);
    setActivePet(pet);
  };

  const selectDatabasePet = (pet) => {
    setActivePet({
      id: pet.id,
      name: pet.petName,
      species: pet.petType,
      breed: "Not provided",
      age: pet.age,
      ageUnit: "months",
      gender: "Not provided",
      location: "Not provided",
      imageURL: pet.imageURL || "",
    });
  };

  return (
    <CardContext.Provider value={{ pets, activePet, addPet, selectDatabasePet }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => useContext(CardContext);