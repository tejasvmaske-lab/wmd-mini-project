import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, user, logout } = useAuth();

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
                {isAuthenticated ? (
                    <>
                        <span className="nav-user" title={user?.email}>
                            {user?.name || user?.email}
                        </span>
                        <button
                            className="find find-admin"
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <button
                        className="find find-admin"
                        onClick={() => navigate("/login", { state: { returnTo: `${location.pathname}${location.search}` } })}
                        disabled={isLoading}
                    >
                        Sign in
                    </button>
                )}
                <button className="find find-admin" onClick={() => navigate("/admin-login")}>
                    Admin
                </button>
            </div>
        </header>
    );
};

export default Navbar;