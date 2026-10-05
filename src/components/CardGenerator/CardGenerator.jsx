import { CardProvider } from "./CardContext";
import DetailForm from "./DetailForm";
import PetCard from "./PetCard";
import "./CardGenerator.css";

function CardGenerator() {
  return (
    <CardProvider>
      <div className="app-container">

        <header className="header">
          <h1>Pet Adoption Portal</h1>
          <p>Pet Registration & Identification</p>
        </header>

        <main className="main-content">
          <DetailForm />
          <PetCard />
        </main>

      </div>
    </CardProvider>
  );
}

export default CardGenerator;