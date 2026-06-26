import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import "../styles/auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const triggerToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            triggerToast("Please fill in both email and password fields.", "error");
            return;
        }

        try {
            const response = await API.post("/api/auth/login", { email, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("name", response.data.name);

            triggerToast("Welcome back! Login Successful ✔", "success");

            setTimeout(() => {
                navigate(response.data.role === "ROLE_ADMIN" ? "/admin-products" : "/products");
            }, 1500);
        } catch (error) {
            console.error(error);
            triggerToast("Invalid credentials. Please verify your email and password.", "error");
        }
    };

    return (
        <div className="auth-page">
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    <span className="toast-icon">{toast.type === "success" ? "🎉" : "🔒"}</span>
                    {toast.message}
                </div>
            )}

            <div className="auth-card">
                <h1 className="auth-title">SmartMart Login</h1>

                <div className="auth-form">
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="auth-btn" onClick={handleLogin}>
                        Login
                    </button>

                    <div className="auth-footer">
                        <Link to="/register">New User? Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;