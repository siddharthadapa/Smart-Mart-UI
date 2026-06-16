import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/addProduct.css";

function AddProduct() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]); // State to hold DB categories

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        categoryId: "", // Selected category from dropdown
    });

    // Fetch categories on page load
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await API.get("/api/categories");
            setCategories(response.data);
            if (response.data.length > 0) {
                setProduct(prev => ({ ...prev, categoryId: response.data[0].id }));
            }
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!product.categoryId) {
            alert("Please create or select a product category first.");
            return;
        }

        try {
            setLoading(true);

            const productPayload = {
                name: product.name,
                description: product.description,
                price: Number(product.price),
                stock: Number(product.stock),
                imageUrl: product.imageUrl,
                category: {
                    id: Number(product.categoryId)
                }
            };

            await API.post("/api/products", productPayload);
            alert("Product Added Successfully!");
            navigate("/admin-products");
        } catch (error) {
            console.error(error);
            alert("Failed To Add Product. Ensure your Admin Token is active.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">
            <Navbar />

            <div className="add-product-container">
                <div className="add-product-card">
                    <h1 className="add-product-title">Add Product</h1>

                    <form onSubmit={handleFormSubmit} className="add-product-form">
                        <input
                            className="add-input"
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            className="add-textarea"
                            name="description"
                            placeholder="Description"
                            value={product.description}
                            onChange={handleChange}
                            required
                            rows="4"
                        />

                        <input
                            className="add-input"
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />

                        <input
                            className="add-input"
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={product.stock}
                            onChange={handleChange}
                            required
                        />

                        <input
                            className="add-input"
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={product.imageUrl}
                            onChange={handleChange}
                            required
                        />

                        {/* Direct Selection Dropdown вместо Category ID input */}
                        <div style={{ textAlign: "left", marginBottom: "15px" }}>
                            <label style={{ fontWeight: "bold", fontSize: "14px" }}>Product Category:</label>
                            <select
                                className="add-input"
                                name="categoryId"
                                value={product.categoryId}
                                onChange={handleChange}
                                style={{ width: "100%", padding: "12px", marginTop: "5px" }}
                                required
                            >
                                {categories.length === 0 ? (
                                    <option value="">-- No Categories Found in DB --</option>
                                ) : (
                                    categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name} (ID: {cat.id})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="add-btn"
                            disabled={loading}
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/admin-products")}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;