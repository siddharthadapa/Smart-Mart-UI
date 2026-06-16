import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import "../styles/auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Smooth custom toast notification state
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const navigate = useNavigate();

    const triggerToast = (message, type) => {
        setToast({ show: true, message, type });
        // Automatically dismantle the notification banner after 2.5 seconds
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
        }, 2500);
    };

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                triggerToast("Please fill in both email and password fields.", "error");
                return;
            }

            const response = await API.post("/api/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("name", response.data.name);

            // Trigger sleek modern green success message notification
            triggerToast("Welcome back! Login Successful ✔", "success");

            // Hold navigation back slightly so the user can experience the professional transition animation
            setTimeout(() => {
                if (response.data.role === "ROLE_ADMIN") {
                    navigate("/admin-products");
                } else {
                    navigate("/products");
                }
            }, 1500);

        } catch (error) {
            console.error(error);
            triggerToast("Invalid credentials. Please verify your email and password.", "error");
        }
    };

    return (
        <div className="auth-page">
            
            {/* IN-APP TOAST NOTIFICATION CARD */}
            {toast.show && (
                <div style={{
                    position: "fixed",
                    top: "24px",
                    right: "24px",
                    zIndex: 10000,
                    backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
                    color: "#ffffff",
                    padding: "14px 24px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "14px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    animation: "slideDownEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                }}>
                    <span style={{ fontSize: "16px" }}>{toast.type === "success" ? "🎉" : "🔒"}</span>
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
            
            {/* CSS Animation Keyframes Injector */}
            <style>{`
                @keyframes slideDownEntrance {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default Login;