# Smart-Mart — E-Commerce Web Application

A full-stack e-commerce platform (Amazon/Flipkart-style) with JWT authentication, product catalog, cart, checkout, and order management — built with Spring Boot, Spring Security, MySQL, and React, and containerized with Docker.

## 🚀 Features
- User registration and login with JWT-based authentication
- Browse products by category
- Add to cart, view cart, place an order
- Manage delivery addresses
- Make and track payments per order
- Cancel an order
- Admin-only product management (add/update/delete), gated by role-based frontend routes

## 🛠️ Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA, MySQL, Lombok
- **Auth:** JWT (stateless), custom `JwtFilter` + `JwtUtil`
- **Frontend:** React, Axios
- **Deployment:** Dockerfile included for containerized backend deployment

## 🏗️ Architecture
The React frontend calls the backend through a JWT-secured REST API. Every request passes through a custom `JwtFilter` before reaching the controller. Controllers delegate to a service layer (interface + implementation), which uses Spring Data JPA repositories to persist and query MySQL. `SecurityConfig` wires up Spring Security to protect endpoints based on the authenticated user's role.

## 📡 API Endpoints
| Controller | Method | Endpoint | Description |
|---|--------|----------|-------------|
| Auth | POST | /api/auth/register | Register a new user |
| Auth | POST | /api/auth/login | Authenticate and receive JWT |
| Products | POST | /api/products | Add a product |
| Products | GET | /api/products | List all products |
| Products | PUT | /api/products/{id} | Update a product |
| Products | DELETE | /api/products/{id} | Delete a product |
| Categories | POST | /api/categories | Add a category |
| Categories | GET | /api/categories | List all categories |
| Cart | GET | /api/cart/{userId} | Get a user's cart |
| Cart | POST | /api/cart/add | Add item to cart |
| Address | POST | /api/address/{userId} | Add an address for a user |
| Address | GET | /api/address/{userId} | Get a user's addresses |
| Orders | POST | /api/orders/place/{userId}/{addressId} | Place an order |
| Orders | GET | /api/orders/user/{userId} | Get orders for a user |
| Orders | GET | /api/orders/{orderId} | Get order details |
| Orders | PUT | /api/orders/cancel/{orderId} | Cancel an order |
| Payments | POST | /api/payments/pay/{orderId} | Make a payment for an order |
| Payments | GET | /api/payments/order/{orderId} | Get payment by order |
| Payments | GET | /api/payments/{paymentId} | Get payment by ID |

**19 REST endpoints across 8 controllers.**

## 🗄️ Database Schema (9 entities)
User, Product, Category, Cart, CartItem, Order, OrderItem, Payment, Address

## 🖥️ Frontend Pages (9)
Login, Register, Products, Cart, Orders, Address, Add Product, Edit Product, Admin Products — with route guards (`AdminRoute`, `ProtectedRoute`, `UserOnlyRoute`) enforcing role-based access.

## ⚙️ Setup & Installation
```bash
# Backend
cd smart-mart
./mvnw spring-boot:run
# or with Docker:
docker build -t smart-mart-backend .
docker run -p 8080:8080 smart-mart-backend

# Frontend
cd Smart-Mart-UI
npm install
npm run dev
```

## 📸 Screenshots
<!-- Add screenshots: login, product listing, cart, checkout, admin product management -->

## 🔮 Future Improvements
- Product reviews and ratings
- Real payment gateway integration (currently a payment record, not a live gateway)
- Order tracking with status updates

## 👤 Author
Adapa Phani Venkata Siddhardha — [LinkedIn](https://linkedin.com/in/adapa-phani-venkata-siddhardha) | [GitHub](https://github.com/siddharthadapa)
