import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/adminProducts.css";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const getProducts = () => {
        API.get("/api/products")
            .then((res) => setProducts(res.data))
            .catch(console.log);
    };

    useEffect(() => {
        getProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await API.delete(`/api/products/${id}`);
            alert("Product Deleted Successfully");
            getProducts();
        } catch (error) {
            console.log(error);
            alert("Delete Failed");
        }
    };

    return (
        <div className="admin-page">
            <Navbar />

            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin Products</h1>
                    <button className="add-product-btn" onClick={() => navigate("/add-product")}>
                        + Add Product
                    </button>
                </div>

                <div className="admin-grid">
                    {products.map((product) => (
                        <div key={product.id} className="admin-card">
                            <div className="admin-image-wrapper">
                                <img src={product.imageUrl} alt={product.name} className="admin-image" />
                            </div>

                            <div className="admin-content">
                                <h2 className="admin-title">{product.name}</h2>
                                <p className="admin-desc">{product.description}</p>
                                <div className="admin-price">₹ {product.price}</div>

                                <div className="admin-meta">
                                    <span>Stock: {product.stock}</span>
                                    <span>{product.category?.name}</span>
                                </div>

                                <div className="admin-actions">
                                    <button className="update-btn" onClick={() => navigate(`/edit-product/${product.id}`)}>
                                        Update
                                    </button>
                                    <button className="delete-btn" onClick={() => deleteProduct(product.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminProducts;