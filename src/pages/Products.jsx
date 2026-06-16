import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 6;

    useEffect(() => {
        getProducts();
        getCategories();
    }, []);

    useEffect(() => {
        let result = [...products];

        if (search) {
            result = result.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory) {
            result = result.filter(
                (product) =>
                    product.category &&
                    product.category.id === Number(selectedCategory)
            );
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [search, selectedCategory, products]);

    const getProducts = async () => {
        try {
            const response = await API.get("/api/products");
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCategories = async () => {
        try {
            const response = await API.get("/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const addToCart = async (productId) => {
        try {
            const userId = localStorage.getItem("userId");

            await API.post(
                `/api/cart/add?userId=${userId}&productId=${productId}&quantity=1`
            );

            alert("Product Added To Cart");
        } catch (error) {
            console.log(error);
            alert("Failed To Add Product");
        }
    };

    const lastIndex = currentPage * productsPerPage;
    const firstIndex = lastIndex - productsPerPage;

    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="products-page">
            <Navbar />

            <div className="products-container">
                <h1 className="page-title">Products</h1>

                {/* FILTER BAR */}
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

                {/* PRODUCT GRID */}
                <div className="product-grid">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-image"
                                />
                            </div>

                            <div className="product-content">
                                <h3 className="product-title">{product.name}</h3>

                                <p className="product-desc">{product.description}</p>

                                <div className="product-price">₹ {product.price}</div>

                                <div className="product-meta">
                                    <span>Stock: {product.stock}</span>
                                    <span>{product.category?.name}</span>
                                </div>

                                <button
                                    className="add-cart-btn"
                                    onClick={() => addToCart(product.id)}
                                >
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PAGINATION */}
                <div className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`page-btn ${
                                currentPage === index + 1 ? "active" : ""
                            }`}
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