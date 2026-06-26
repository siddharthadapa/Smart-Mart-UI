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
        categoryId: "",
    });

    useEffect(() => {
        API.get("/api/categories")
            .then((res) => setCategories(res.data))
            .catch((error) => console.error("Failed to load categories:", error));

        API.get("/api/products")
            .then((res) => {
                const found = res.data.find((p) => p.id === Number(id));
                if (found) {
                    setProduct({
                        name: found.name || "",
                        description: found.description || "",
                        price: found.price || "",
                        stock: found.stock || "",
                        imageUrl: found.imageUrl || "",
                        categoryId: found.category ? found.category.id : "",
                    });
                } else {
                    alert("Product not found.");
                    navigate("/admin-products");
                }
            })
            .catch((error) => console.error(error));
    }, [id, navigate]);

    const handleChange = (e) =>
        setProduct({ ...product, [e.target.name]: e.target.value });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put(`/api/products/${id}`, {
                ...product,
                price: Number(product.price),
                stock: Number(product.stock),
                category: product.categoryId ? { id: Number(product.categoryId) } : null,
            });
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
                        <label className="add-label">Product Title</label>
                        <input className="add-input" type="text" name="name" value={product.name} onChange={handleChange} required />

                        <label className="add-label">Product Description</label>
                        <textarea className="add-textarea" name="description" value={product.description} onChange={handleChange} rows="3" required />

                        <label className="add-label">Price (INR)</label>
                        <input className="add-input" type="number" name="price" value={product.price} onChange={handleChange} required />

                        <label className="add-label">Available Inventory Units</label>
                        <input className="add-input" type="number" name="stock" value={product.stock} onChange={handleChange} required />

                        <label className="add-label">Product Image Link</label>
                        <input className="add-input" type="text" name="imageUrl" value={product.imageUrl} onChange={handleChange} required />

                        <label className="add-label">Category Assignment Group</label>
                        <select className="add-input" name="categoryId" value={product.categoryId} onChange={handleChange} required>
                            <option value="">-- Choose Target Classification --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
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