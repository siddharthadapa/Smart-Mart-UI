import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import AdminProducts from "./pages/AdminProducts";
import EditProduct from "./pages/EditProduct";
import Address from "./pages/Address";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserOnlyRoute from "./components/UserOnlyRoute";

// Global CSS
import "./styles/global.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* GENERAL AUTHENTICATED ROUTES */}
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />

                {/* CUSTOMER USER-ONLY ROUTES */}
                <Route
                    path="/cart"
                    element={
                        <UserOnlyRoute>
                            <Cart />
                        </UserOnlyRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <UserOnlyRoute>
                            <Orders />
                        </UserOnlyRoute>
                    }
                />

                <Route
                    path="/address"
                    element={
                        <UserOnlyRoute>
                            <Address />
                        </UserOnlyRoute>
                    }
                />

                {/* ADMIN-ONLY MANAGEMENT ROUTES */}
                <Route
                    path="/admin-products"
                    element={
                        <AdminRoute>
                            <AdminProducts />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/add-product"
                    element={
                        <AdminRoute>
                            <AddProduct />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/edit-product/:id"
                    element={
                        <AdminRoute>
                            <EditProduct />
                        </AdminRoute>
                    }
                />

                {/* FRIENDLY 404 CATCH-ALL ROUTE */}
                <Route 
                    path="*" 
                    element={
                        <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "var(--sans)" }}>
                            <h2 style={{ fontSize: "36px", color: "var(--text-h)" }}>404 Not Found</h2>
                            <p style={{ margin: "20px 0", color: "var(--text)" }}>
                                Oops! The page you are looking for doesn't exist.
                            </p>
                            <Link 
                                to="/products" 
                                style={{ 
                                    color: "var(--accent)", 
                                    textDecoration: "underline",
                                    fontWeight: "500" 
                                }}
                            >
                                Back to SmartMart Products
                            </Link>
                        </div>
                    } 
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;