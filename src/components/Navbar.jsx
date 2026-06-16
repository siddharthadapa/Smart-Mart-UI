import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        setRole(localStorage.getItem("role"));
        setUserName(localStorage.getItem("name") || "");
    }, [location]); // Automatically syncs links whenever user moves between views

    const logout = () => {
        localStorage.clear();
        setRole(null);
        setUserName("");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* LOGO */}
                <div className="logo" onClick={() => navigate(role === "ROLE_ADMIN" ? "/admin-products" : "/products")}>
                    SmartMart
                </div>

                {/* NAV LINKS */}
                <div className="nav-links">
                    <Link to="/products">Products</Link>

                    {role === "ROLE_USER" && (
                        <>
                            <Link to="/cart">Cart</Link>
                            <Link to="/orders">Orders</Link>
                            <Link to="/address">Address</Link>
                        </>
                    )}

                    {role === "ROLE_ADMIN" && (
                        <>
                            <Link to="/admin-products">Admin Dashboard</Link>
                            <Link to="/add-product">Add Product</Link>
                        </>
                    )}

                    {!role && (
                        <>
                            <Link to="/">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>

                {/* RIGHT SIDE PROFILE TRACKING */}
                <div className="nav-right">
                    {role && (
                        <span className="role-badge">
                            {userName ? `${userName} (${role.replace("ROLE_", "")})` : role.replace("ROLE_", "")}
                        </span>
                    )}

                    {role && (
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;