import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/cart.css";

const PAYMENT_METHODS = [
    { key: "COD", label: "💵 Cash On Delivery" },
    { key: "UPI", label: "📲 UPI Transfer" },
    { key: "CARD", label: "💳 Debit/Credit Card" },
    { key: "GIFT_CARD", label: "🎁 Gift Voucher" },
];

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [processing, setProcessing] = useState(false);

    const [payment, setPayment] = useState({
        method: "COD",
        upiId: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
        voucherCode: "",
    });
    const updatePayment = (patch) => setPayment((prev) => ({ ...prev, ...patch }));

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        API.get(`/api/cart/${userId}`)
            .then((res) => setCart(res.data))
            .catch((error) => console.error("Error fetching cart:", error));

        API.get(`/api/address/${userId}`)
            .then((res) => {
                setAddresses(res.data);
                if (res.data.length > 0) setSelectedAddressId(res.data[0].id);
            })
            .catch((error) => console.error("Error fetching addresses:", error));
    }, []);

    const total = (cart?.items || []).reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const placeOrderPipeline = async () => {
        if (!selectedAddressId) {
            alert("Please add and select a shipping address first!");
            return;
        }
        if (payment.method === "UPI" && !payment.upiId.includes("@")) {
            alert("Please enter a valid UPI ID (e.g., name@okaxis)");
            return;
        }
        if (payment.method === "CARD" && (payment.cardNumber.trim().length < 16 || !payment.cardExpiry || !payment.cardCvv)) {
            alert("Please provide valid Card information parameters.");
            return;
        }
        if (payment.method === "GIFT_CARD" && payment.voucherCode.trim().length < 3) {
            alert("Please enter a valid Gift Voucher code.");
            return;
        }

        setProcessing(true);
        try {
            const userId = localStorage.getItem("userId");
            const orderResponse = await API.post(`/api/orders/place/${userId}/${selectedAddressId}`);

            await API.post(`/api/payments/pay/${orderResponse.data.id}`, {
                paymentMethod: payment.method,
                upiId: payment.upiId,
                cardNumber: payment.cardNumber,
                voucherCode: payment.voucherCode,
            });

            alert(`Order Placed Successfully via ${payment.method}!`);
            navigate("/orders");
        } catch (error) {
            console.error("Checkout Exception Error Details:", error);
            alert("Checkout processing fault. Double check items inventory stocks.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="cart-page">
            <Navbar />
            <div className="cart-container">
                <h1 className="page-title">My SmartMart Cart</h1>

                {!cart?.items || cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Cart Is Empty</h2>
                        <p>Add some products to continue shopping</p>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            <h2 className="cart-section-title">Selected Items</h2>
                            {cart.items.map((item) => (
                                <div key={item.id} className="cart-card">
                                    <h2 className="item-title">{item.product.name}</h2>
                                    <div className="item-row"><span>Price:</span><span>₹ {item.product.price}</span></div>
                                    <div className="item-row"><span>Quantity:</span><span>{item.quantity}</span></div>
                                    <div className="item-row total-row"><span>Sub Total:</span><span>₹ {item.quantity * item.product.price}</span></div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2 className="cart-section-title">Order Summary</h2>

                            <div className="address-select-box">
                                <label className="cart-label">Deliver To Destination:</label>
                                {addresses.length === 0 ? (
                                    <p className="cart-warning">No saved addresses found. Add one in the Address page.</p>
                                ) : (
                                    <select
                                        value={selectedAddressId}
                                        onChange={(e) => setSelectedAddressId(e.target.value)}
                                        className="address-select"
                                    >
                                        {addresses.map((addr) => (
                                            <option key={addr.id} value={addr.id}>
                                                {addr.fullName} - {addr.street}, {addr.city} ({addr.pincode})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="payment-section">
                                <label className="cart-label">Select Payment Mode:</label>
                                <div className="payment-method-grid">
                                    {PAYMENT_METHODS.map((m) => (
                                        <button
                                            key={m.key}
                                            type="button"
                                            className={`payment-btn ${payment.method === m.key ? "payment-btn-active" : ""}`}
                                            onClick={() => updatePayment({ method: m.key })}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {payment.method === "UPI" && (
                                <div className="payment-fields">
                                    <label className="cart-label">Enter Virtual Payment Address (UPI ID):</label>
                                    <input
                                        type="text"
                                        placeholder="username@upi"
                                        value={payment.upiId}
                                        onChange={(e) => updatePayment({ upiId: e.target.value })}
                                        className="address-input"
                                    />
                                </div>
                            )}

                            {payment.method === "CARD" && (
                                <div className="payment-fields">
                                    <label className="cart-label">Card Number:</label>
                                    <input
                                        type="text"
                                        maxLength="16"
                                        placeholder="4321 5678 9876 5432"
                                        value={payment.cardNumber}
                                        onChange={(e) => updatePayment({ cardNumber: e.target.value })}
                                        className="address-input"
                                    />
                                    <div className="payment-fields-row">
                                        <div>
                                            <label className="cart-label">Expiry:</label>
                                            <input
                                                type="text"
                                                maxLength="5"
                                                placeholder="MM/YY"
                                                value={payment.cardExpiry}
                                                onChange={(e) => updatePayment({ cardExpiry: e.target.value })}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="cart-label">CVV Security:</label>
                                            <input
                                                type="password"
                                                maxLength="3"
                                                placeholder="***"
                                                value={payment.cardCvv}
                                                onChange={(e) => updatePayment({ cardCvv: e.target.value })}
                                                className="address-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {payment.method === "GIFT_CARD" && (
                                <div className="payment-fields">
                                    <label className="cart-label">Enter Active Voucher Code:</label>
                                    <input
                                        type="text"
                                        placeholder="SMART-MART-500"
                                        value={payment.voucherCode}
                                        onChange={(e) => updatePayment({ voucherCode: e.target.value })}
                                        className="address-input"
                                    />
                                </div>
                            )}

                            <div className="cart-total-box">
                                <h2 className="cart-total">Total Amount: ₹ {total}</h2>
                                <button
                                    className="place-order-btn"
                                    onClick={placeOrderPipeline}
                                    disabled={processing}
                                >
                                    {processing ? "Verifying Transaction Details..." : `Place Order with ${payment.method}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;