import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const userId = localStorage.getItem("userId");

            const response = await API.get(
                `/api/orders/user/${userId}`
            );

            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const cancelOrder = async (orderId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;

        try {
            const response = await API.put(
                `/api/orders/cancel/${orderId}`
            );

            alert(response.data);
            getOrders();
        } catch (error) {
            console.log(error);
            alert("Cancel Failed");
        }
    };

    return (
        <div className="orders-page">
            <Navbar />

            <div className="orders-container">
                <h1 className="page-title">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Orders Found</h2>
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h2 className="order-id">
                                        Order #{order.id}
                                    </h2>

                                    <span
                                        className={`status-badge ${
                                            order.status === "CANCELLED"
                                                ? "cancelled"
                                                : "active"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-divider" />

                                <div className="order-details">
                                    <p>
                                        <span>Amount:</span> ₹{order.totalAmount}
                                    </p>

                                    <p>
                                        <span>Date:</span>{" "}
                                        {new Date(order.orderDate).toLocaleString()}
                                    </p>
                                </div>

                                {order.status !== "CANCELLED" && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => cancelOrder(order.id)}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;