import { Navigate } from "react-router-dom";

function UserOnlyRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Not logged in → send to login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Admin should not access user routes
    if (role === "ROLE_ADMIN") {
        return <Navigate to="/admin-products" replace />;
    }

    return children;
}

export default UserOnlyRoute;