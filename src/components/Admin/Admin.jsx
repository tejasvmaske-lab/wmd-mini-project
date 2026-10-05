import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
const [petName, setPetName] = useState("");
const [petType, setPetType] = useState("");
const [age, setAge] = useState("");
const [imageURL, setImageURL] = useState("");
const [editingPetId, setEditingPetId] = useState(null);

const navigate = useNavigate();

useEffect(() => {
    const verifyToken = async () => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin-login");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/dashboard",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                localStorage.removeItem("adminToken");
                navigate("/admin-login");
            }

        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    verifyToken();
}, [navigate]);

const [pets, setPets] = useState([]);

const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
};

function clearForm() {
    setPetName("");
    setPetType("");
    setAge("");
    setImageURL("");
    setEditingPetId(null);
}

function editPet(pet) {
    setEditingPetId(pet.id);
    setPetName(pet.petName);
    setPetType(pet.petType);
    setAge(String(pet.age));
    setImageURL(pet.imageURL || "");
    document.getElementById("petForm").scrollIntoView({ behavior: "smooth" });
}

// ADD OR UPDATE PET
async function addPet() {
    const petData = {
        petName,
        petType,
        age: Number(age),
        imageURL,
    };
    const isEditing = editingPetId !== null;
    const url = isEditing
        ? `http://localhost:8081/pets/${editingPetId}`
        : "http://localhost:8081/pets";

    try {
        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(petData),
        });

        if (!response.ok) {
            throw new Error(`The pet could not be ${isEditing ? "updated" : "added"}.`);
        }

        alert(isEditing ? "Pet details updated successfully!" : "New pet added successfully!");
        clearForm();
        await loadPets();
    } catch (error) {
        console.error(`Error ${isEditing ? "updating" : "adding"} pet:`, error);
        alert(`Unable to ${isEditing ? "update" : "add"} pet. Please check that the Spring Boot server is running.`);
    }
}

async function deletePet(petId) {
    if (!window.confirm("Are you sure you want to remove this pet?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/pets/${petId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("The pet could not be removed.");
        }

        if (editingPetId === petId) {
            clearForm();
        }
        await loadPets();
    } catch (error) {
        console.error("Error removing pet:", error);
        alert("Unable to remove pet. Please check that the Spring Boot server is running.");
    }
}

// Function to get all pets from Spring Boot
async function loadPets() {
    try {
        const response = await fetch("http://localhost:8081/pets");

        if (!response.ok) {
            throw new Error("The pet list could not be loaded.");
        }

        const data = await response.json();
        setPets(data);
    } catch (error) {
        console.error("Error loading pets:", error);
        alert("Unable to load pets. Please check that the Spring Boot server is running.");
    }
}

    return (
        <div className="admin-container">
            <div className="heading">
                <h1>Admin Dashboard</h1>
            </div>

            <button onClick={handleLogout} className="logout-btn">
    Logout
</button>

            <form id="petForm">
                <input
                    type="text"
                    id="petName"
                    placeholder="Pet Name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    required
                />

                <select id="petType"
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    required>
                    <option value="">Select type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                </select>

                <input
                    type="number"
                    id="age"
                    placeholder="Age (in months)"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />

                <input 
                    type="text"
                    id="imageURL"
                    placeholder="Image URL for the pet"
                    required
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                />

                <div className="buttons">
                    <button type="button" id="addData" onClick={addPet}>
                        {editingPetId === null ? "Add" : "Save Changes"}
                    </button>

                    {editingPetId !== null && (
                        <button type="button" id="cancelEdit" onClick={clearForm}>
                            Cancel
                        </button>
                    )}

                    <button type="button" id="showPets" onClick={loadPets}>
                        Show All Pets
                    </button>
                </div>
            </form>

            <h2>Pet Inventory</h2>

            <table id="petTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Age</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody id="petTableBody">
                    {pets.map((pet, index) => (
                        <tr key={pet.id}>
                            <td>{index + 1}</td>
                            <td>{pet.petName}</td>
                            <td>{pet.petType}</td>
                            <td>{pet.age}</td>
                            <td>
                                {pet.imageURL ? (
                                    <img
                                        src={pet.imageURL}
                                        alt={pet.petName}
                                        onError={(event) => {
                                            event.currentTarget.hidden = true;
                                        }}
                                    />
                                ) : "No image"}
                            </td>
                            <td className="pet-actions">
                                <button type="button" onClick={() => editPet(pet)}>
                                    Edit
                                </button>
                                <button type="button" onClick={() => deletePet(pet.id)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Admin;