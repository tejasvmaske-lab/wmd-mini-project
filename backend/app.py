from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app)

SECRET_KEY = "pet-adoption-secret-key"

# Dummy admin credentials for testing
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"


@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:

        token = jwt.encode(
            {
                "username": username,
                "role": "ADMIN",
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(minutes=30)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login successful",
            "token": token
        })

    return jsonify({
        "message": "Invalid username or password"
    }), 401


@app.route("/dashboard", methods=["GET"])
def dashboard():

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({
            "message": "Token is missing"
        }), 401

    try:

        token = auth_header.split(" ")[1]

        decoded = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        return jsonify({
            "message": "Welcome to Admin Dashboard",
            "user": decoded["username"],
            "role": decoded["role"]
        })

    except jwt.ExpiredSignatureError:

        return jsonify({
            "message": "Token has expired"
        }), 401

    except jwt.InvalidTokenError:

        return jsonify({
            "message": "Invalid token"
        }), 401


if __name__ == "__main__":
    app.run(debug=True, port=5000)