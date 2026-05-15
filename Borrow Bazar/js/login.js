// Smart API URL: Use relative path if on port 3000, otherwise point to localhost:3000
const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

function toggleForms() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('signupForm').classList.toggle('hidden');
}

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert(data.message || "Login failed");
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("An error occurred during login.");
    }
}

async function register() {
    const name = document.getElementById("signupName").value;
    const college = document.getElementById("signupCollege").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!name || !college || !email || !password) {
        alert("All fields are required.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, college, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! Please login.");
            toggleForms();
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (err) {
        console.error("Registration error:", err);
        alert("An error occurred during registration.");
    }
}
