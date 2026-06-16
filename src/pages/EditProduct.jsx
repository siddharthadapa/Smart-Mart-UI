import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/editProduct.css";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        categoryId: "" // Preserves the category mapping connection state safely
    });

    useEffect(() => {
        const initializationSequence = async () => {
            try {
                // 1. Pull downstream option lists cleanly
                const catResponse = await API.get("/api/categories");
                setCategories(catResponse.data);

                // 2. Fetch specific product by ID via base endpoints
                const prodResponse = await API.get("/api/products");
                if (prodResponse.data && Array.isArray(prodResponse.data)) {
                    const found = prodResponse.data.find((p) => p.id === Number(id));
                    if (found) {
                        setProduct({
                            name: found.name || "",
                            description: found.description || "",
                            price: found.price || "",
                            stock: found.stock || "",
                            imageUrl: found.imageUrl || "",
                            categoryId: found.category ? found.category.id : ""
                        });
                    } else {
                        alert("Product not found inside local parameters.");
                        navigate("/admin-products");
                    }
                }
            } catch (error) {
                console.error("Initialization error:", error);
            }
        };

        initializationSequence();
    }, [id, navigate]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Re-maps object configurations to match Backend specifications perfectly
            const updatePayload = {
                name: product.name,
                description: product.description,
                price: Number(product.price),
                stock: Number(product.stock),
                imageUrl: product.imageUrl,
                category: product.categoryId ? { id: Number(product.categoryId) } : null
            };

            await API.put(`/api/products/${id}`, updatePayload);
            alert("Product Updated Successfully!");
            navigate("/admin-products");
        } catch (error) {
            console.error(error);
            alert("Failed to save changes. Verify security privileges.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">
            <Navbar />
            <div className="add-product-container">
                <div className="add-product-card">
                    <h2 className="add-product-title">Edit Product Details</h2>
                    <form onSubmit={handleFormSubmit} className="add-product-form">
                        
                        <label style={{fontWeight: "600", fontSize: "13px"}}>Product Title</label>
                        <input
                            className="add-input"
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />

                        <label style={{fontWeight: "600", fontSize: "13px"}}>Product Description</label>
                        <textarea
                            className="add-textarea"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            rows="3"
                            required
                        />

                        <label style={{fontWeight: "600", fontSize: "13px"}}>Price (INR)</label>
                        <input
                            className="add-input"
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />

                        <label style={{fontWeight: "600", fontSize: "13px"}}>Available Inventory Units</label>
                        <input
                            className="add-input"
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            required
                        />

                        <label style={{fontWeight: "600", fontSize: "13px"}}>Product Image Link</label>
                        <input
                            className="add-input"
                            type="text"
                            name="imageUrl"
                            value={product.imageUrl}
                            onChange={handleChange}
                            required
                        />

                        <label style={{fontWeight: "600", fontSize: "13px"}}>Category Assignment Group</label>
                        <select
                            className="add-input"
                            name="categoryId"
                            value={product.categoryId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Choose Target Classification --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="add-btn" disabled={loading}>
                            {loading ? "Saving Records..." : "Commit Update Operations"}
                        </button>
                        <button type="button" className="cancel-btn" onClick={() => navigate("/admin-products")}>
                            Discard Modifications
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;