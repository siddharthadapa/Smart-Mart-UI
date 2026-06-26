import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/products.css";

const PRODUCTS_PER_PAGE = 6;

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        API.get("/api/products").then((res) => setProducts(res.data)).catch(console.log);
        API.get("/api/categories").then((res) => setCategories(res.data)).catch(console.log);
    }, []);

    // Derived straight from state — no extra "filteredProducts" state or sync effect needed
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || product.category?.id === Number(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    useEffect(() => setCurrentPage(1), [search, selectedCategory]);

    const addToCart = async (productId) => {
        try {
            const userId = localStorage.getItem("userId");
            await API.post(`/api/cart/add?userId=${userId}&productId=${productId}&quantity=1`);
            alert("Product Added To Cart");
        } catch (error) {
            console.log(error);
            alert("Failed To Add Product");
        }
    };

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    return (
        <div className="products-page">
            <Navbar />

            <div className="products-container">
                <h1 className="page-title">Products</h1>

                <div className="filter-bar">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="product-grid">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                            </div>

                            <div className="product-content">
                                <h3 className="product-title">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-price">₹ {product.price}</div>

                                <div className="product-meta">
                                    <span>Stock: {product.stock}</span>
                                    <span>{product.category?.name}</span>
                                </div>

                                <button className="add-cart-btn" onClick={() => addToCart(product.id)}>
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products;