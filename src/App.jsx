import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import HeroImage from "./assets/HeroImage.png";
import Navbar from "./components/Navbar/Navbar.jsx";
import About from "./components/About/About.jsx";
import WhyAdopt from "./components/WhyAdopt/WhyAdopt.jsx";
import Admin from "./components/Admin/Admin.jsx";
import CardGenerator from "./components/CardGenerator/CardGenerator.jsx";
import AdminForm from "./components/Admin/AdminForm.jsx";
import AdoptionPage from "./components/Adoption/AdoptionPage.jsx";

function ProtectedAdmin() {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        window.location.href = "/admin-login";
        return null;
    }

    return <Admin />;
}

function Home() {
    return (
        <main>
            <img
                src={HeroImage}
                alt="A dog, cat, and other pets waiting to be adopted"
                className="hero-image"
            />
            <About />
            <WhyAdopt />
        </main>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin-login" element={<AdminForm />} />
                <Route path="/admin" element={<ProtectedAdmin />} />
                <Route path="/card-generator" element={<CardGenerator />} />
                <Route path="/adopt" element={<AdoptionPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;