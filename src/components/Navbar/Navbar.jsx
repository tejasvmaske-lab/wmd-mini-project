import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="navbar">
                <div className="nav-left">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </div>
                    <div className="right-side">
                    <button className="find" onClick={() => (window.location.href = '#')}>Find
                    </button>
                    <button className="find" onClick={() => navigate("/card-generator")}>Generate ID Card</button>
                    <button className="find" onClick={() => navigate("/admin-login")}>Admin</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;