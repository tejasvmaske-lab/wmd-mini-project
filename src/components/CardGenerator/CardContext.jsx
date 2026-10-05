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

  return (
    <CardContext.Provider value={{ pets, activePet, addPet }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => useContext(CardContext);