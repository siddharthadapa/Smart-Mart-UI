import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const role = localStorage.getItem("role");

    // Strictly validates matching criteria for ROLE_ADMIN strings
    if (role !== "ROLE_ADMIN") {
        return <Navigate to="/products" replace />;
    }

    return children;
}

export default AdminRoute;