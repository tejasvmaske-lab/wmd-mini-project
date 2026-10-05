import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import HeroImage from "./assets/HeroImage.png";
import Navbar from "./components/Navbar/Navbar.jsx";
import About from "./components/About/About.jsx";
import WhyAdopt from "./components/WhyAdopt/WhyAdopt.jsx";
import Admin from "./components/Admin/Admin.jsx";
import CardGenerator from "./components/CardGenerator/CardGenerator.jsx";
import AdminForm from "./components/Admin/AdminForm.jsx";

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
        <div>
            <img src={HeroImage} alt="Hero" className="hero-image" />
            <About />
            <WhyAdopt />
        </div>
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;