import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/cart.css";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [processing, setProcessing] = useState(false);

    // Form inputs state management controls
    const [paymentMethod, setPaymentMethod] = useState("COD"); // Defaults to Cash on Delivery
    const [upiId, setUpiId] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [voucherCode, setVoucherCode] = useState("");

    useEffect(() => {
        getCart();
        getUserAddresses();
    }, []);

    const getCart = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await API.get(`/api/cart/${userId}`);
            setCart(response.data);
            calculateTotal(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const getUserAddresses = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await API.get(`/api/address/${userId}`);
            setAddresses(response.data);
            if (response.data.length > 0) {
                setSelectedAddressId(response.data[0].id); 
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const calculateTotal = (cartData) => {
        if (!cartData || !cartData.items) {
            setTotal(0);
            return;
        }
        let amount = cartData.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        setTotal(amount);
    };

    const placeOrderPipeline = async () => {
        if (!selectedAddressId) {
            alert("Please add and select a shipping address first!");
            return;
        }

        // Enforce frontend field validations based on payment selection types
        if (paymentMethod === "UPI" && !upiId.trim().includes("@")) {
            alert("Please enter a valid UPI ID (e.g., name@okaxis)");
            return;
        }
        if (paymentMethod === "CARD" && (cardNumber.trim().length < 16 || !cardExpiry || !cardCvv)) {
            alert("Please provide valid Card information parameters.");
            return;
        }
        if (paymentMethod === "GIFT_CARD" && voucherCode.trim().length < 3) {
            alert("Please enter a valid Gift Voucher code.");
            return;
        }

        try {
            setProcessing(true);
            const userId = localStorage.getItem("userId");

            // Step 1: Execute master order placement allocation transaction
            const orderResponse = await API.post(`/api/orders/place/${userId}/${selectedAddressId}`);
            const placedOrder = orderResponse.data;

            // Step 2: Build parameters payload block mapping configurations matching the DTO fields
            const paymentRequestPayload = {
                paymentMethod: paymentMethod,
                upiId: upiId,
                cardNumber: cardNumber,
                voucherCode: voucherCode
            };

            // Step 3: Dispatch payment context values downstream to save transaction status logs
            await API.post(`/api/payments/pay/${placedOrder.id}`, paymentRequestPayload);

            alert(`Order Placed Successfully via ${paymentMethod}!`);
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

                {!cart || !cart.items || cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Cart Is Empty</h2>
                        <p>Add some products to continue shopping</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", alignItems: "start" }}>
                        
                        {/* ITEM REVIEWS LIST GRID CONTAINER */}
                        <div className="cart-items">
                            <h2 style={{ fontSize: "20px", marginBottom: "15px", textAlign: "left", fontWeight: "700" }}>Selected Items</h2>
                            {cart.items.map((item) => (
                                <div key={item.id} className="cart-card">
                                    <h2 className="item-title">{item.product.name}</h2>
                                    <div className="item-row">
                                        <span>Price:</span>
                                        <span>₹ {item.product.price}</span>
                                    </div>
                                    <div className="item-row">
                                        <span>Quantity:</span>
                                        <span>{item.quantity}</span>
                                    </div>
                                    <div className="item-row total-row">
                                        <span>Sub Total:</span>
                                        <span>₹ {item.quantity * item.product.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ORDER LOGISTICS SUMMARY CARD AND OPTIONS PANELS */}
                        <div className="cart-summary" style={{ textAlign: "left", padding: "24px" }}>
                            <h2 style={{ fontSize: "20px", marginBottom: "15px", fontWeight: "700" }}>Order Summary</h2>
                            
                            {/* Address Drops Dynamic Selector Section */}
                            <div className="address-select-box" style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>Deliver To Destination:</label>
                                {addresses.length === 0 ? (
                                    <p style={{ color: "red", fontSize: "13px" }}>No saved addresses found. Add one in the Address page view layout setup.</p>
                                ) : (
                                    <select 
                                        value={selectedAddressId} 
                                        onChange={(e) => setSelectedAddressId(e.target.value)}
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    >
                                        {addresses.map((addr) => (
                                            <option key={addr.id} value={addr.id}>
                                                {addr.fullName} - {addr.street}, {addr.city} ({addr.pincode})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Payment Method Option Selection Grid */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>Select Payment Mode:</label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod("COD")}
                                        style={{ padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "2px solid", borderColor: paymentMethod === "COD" ? "#2563eb" : "#ccc", background: paymentMethod === "COD" ? "#eff6ff" : "#fff" }}
                                    >
                                        💵 Cash On Delivery
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod("UPI")}
                                        style={{ padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "2px solid", borderColor: paymentMethod === "UPI" ? "#2563eb" : "#ccc", background: paymentMethod === "UPI" ? "#eff6ff" : "#fff" }}
                                    >
                                        📲 UPI Transfer
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod("CARD")}
                                        style={{ padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "2px solid", borderColor: paymentMethod === "CARD" ? "#2563eb" : "#ccc", background: paymentMethod === "CARD" ? "#eff6ff" : "#fff" }}
                                    >
                                        💳 Debit/Credit Card
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod("GIFT_CARD")}
                                        style={{ padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "2px solid", borderColor: paymentMethod === "GIFT_CARD" ? "#2563eb" : "#ccc", background: paymentMethod === "GIFT_CARD" ? "#eff6ff" : "#fff" }}
                                    >
                                        🎁 Gift Voucher
                                    </button>
                                </div>
                            </div>

                            {/* DYNAMIC FORMS ACCORDING TO USER OPTION CLICKS */}
                            {paymentMethod === "UPI" && (
                                <div style={{ background: "#f9fafb", padding: "14px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "15px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600" }}>Enter Virtual Payment Address (UPI ID):</label>
                                    <input type="text" placeholder="username@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "6px" }} />
                                </div>
                            )}

                            {paymentMethod === "CARD" && (
                                <div style={{ background: "#f9fafb", padding: "14px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div>
                                        <label style={{ fontSize: "13px", fontWeight: "600" }}>Card Number:</label>
                                        <input type="text" maxLength="16" placeholder="4321 5678 9876 5432" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "3px", border: "1px solid #ccc", borderRadius: "6px" }} />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div>
                                            <label style={{ fontSize: "13px", fontWeight: "600" }}>Expiry:</label>
                                            <input type="text" maxLength="5" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "3px", border: "1px solid #ccc", borderRadius: "6px" }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "13px", fontWeight: "600" }}>CVV Security:</label>
                                            <input type="password" maxLength="3" placeholder="***" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "3px", border: "1px solid #ccc", borderRadius: "6px" }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "GIFT_CARD" && (
                                <div style={{ background: "#f9fafb", padding: "14px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "15px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600" }}>Enter Active Voucher Code:</label>
                                    <input type="text" placeholder="SMART-MART-500" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "6px" }} />
                                </div>
                            )}

                            {/* TOTAL METRICS DISPLAY HUB FOOTER CONTAINER */}
                            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px", marginTop: "15px" }}>
                                <h2 style={{ fontSize: "22px", color: "#111827", fontWeight: "700" }}>Total Amount: ₹ {total}</h2>
                                <button 
                                    className="place-order-btn" 
                                    onClick={placeOrderPipeline}
                                    disabled={processing || !cart || cart.items.length === 0}
                                    style={{ width: "100%", padding: "12px", marginTop: "10px", fontSize: "15px" }}
                                >
                                    {processing ? "Verifying Transaction Details..." : `Place Order with ${paymentMethod}`}
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