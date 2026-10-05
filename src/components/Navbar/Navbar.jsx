import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    return (
        <header className="navbar">
            <Link className="brand" to="/" aria-label="Pawfect home">
                pawfect<span>.</span>
            </Link>
            <nav className="nav-left" aria-label="Main navigation">
                <Link to="/">Home</Link>
                <a href="/#about">About</a>
            </nav>
            <div className="right-side">
                <Link className="find" to="/adopt">Find a friend</Link>
                <button className="find find-secondary" onClick={() => navigate("/card-generator")}>
                    Pet ID card
                </button>
                <button className="find find-admin" onClick={() => navigate("/admin-login")}>
                    Admin
                </button>
            </div>
        </header>
    );
};

export default Navbar;