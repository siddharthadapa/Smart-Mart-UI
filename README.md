# Smart-Mart — E-Commerce Web Application

A full-stack e-commerce platform (Amazon/Flipkart-style) with secure JWT authentication, product catalog, cart, and order management — built with Spring Boot, Spring Security, MySQL, and React.

## 🚀 Features
<!-- Fill in what you actually built, remove what you didn't -->
- User registration and login with JWT-based authentication
- Browse and search product catalog
- Add to cart / update quantity / remove from cart
- Place an order and view order history
- (Admin only, if you have it) Add/edit/remove products

## 🛠️ Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA, MySQL
- **Frontend:** React, Bootstrap
- **Auth:** JWT (stateless)
- **Build tool:** Maven

## 🏗️ Architecture
<!-- Example — edit to match reality: -->
React frontend calls REST APIs secured by Spring Security. On login, the backend issues a JWT, which the frontend attaches to every subsequent request. Spring Data JPA maps entities (User, Product, Order, Cart) to MySQL tables, with joins used for order-history and cart-summary queries.

## 📡 API Endpoints
<!-- Open your @RestController classes and list every endpoint here. Count them — that number goes straight on your resume as "X+ REST endpoints" instead of a vague claim. -->
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Authenticate and receive JWT |
| GET | /api/products | List all products |
| GET | /api/products/{id} | Get product details |
| POST | /api/cart | Add item to cart |
| GET | /api/cart | View current cart |
| POST | /api/orders | Place an order |
| GET | /api/orders | View order history |
<!-- ^ Replace/extend with your ACTUAL endpoints -->

## 🗄️ Database Schema
<!-- List your actual tables/entities. This gives you a real "modeled X relational tables" fact for your resume. -->
- Users
- Products
- Cart / CartItems
- Orders / OrderItems

## ⚙️ Setup & Installation
```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm start
```

## 📸 Screenshots
<!-- Add screenshots of login, product listing, cart, and checkout -->

## 🔮 Future Improvements
- (e.g., payment gateway integration, product reviews, order tracking)

## 👤 Author
Adapa Phani Venkata Siddhardha — [LinkedIn](https://linkedin.com/in/adapa-phani-venkata-siddhardha) | [GitHub](https://github.com/siddharthadapa)
