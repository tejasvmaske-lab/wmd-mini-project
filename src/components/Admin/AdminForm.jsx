import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminForm.css";

function AdminForm() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the actual JWT received from the server
                localStorage.setItem("adminToken", data.token);

                setError("");

                // Go to Admin Dashboard
                navigate("/admin");
            } else {
                setError(data.message);
            }

        } catch (error) {
            setError("Unable to connect to server.");
        }
    };

    return (
        <div className="admin-form">

            <h2>Admin Login</h2>

            <form onSubmit={handleLogin}>

                <div className="form-group">
                    <label htmlFor="username">
                        Username:
                    </label>

                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        Password:
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default AdminForm;