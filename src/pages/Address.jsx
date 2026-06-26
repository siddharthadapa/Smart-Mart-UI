import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import "../styles/address.css";

function Address() {
    const [addresses, setAddresses] = useState([]);

    const [address, setAddress] = useState({
        fullName: "",
        mobile: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
    });

    const getAddresses = () => {
        const userId = localStorage.getItem("userId");
        API.get(`/api/address/${userId}`)
            .then((res) => setAddresses(res.data))
            .catch(console.log);
    };

    useEffect(() => {
        getAddresses();
    }, []);

    const handleChange = (e) =>
        setAddress({ ...address, [e.target.name]: e.target.value });

    const saveAddress = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("userId");
            await API.post(`/api/address/${userId}`, address);
            alert("Address Saved Successfully");

            setAddress({
                fullName: "", mobile: "", street: "", city: "",
                state: "", pincode: "", country: "",
            });

            getAddresses();
        } catch (error) {
            console.log(error);
            alert("Failed To Save Address");
        }
    };

    return (
        <div className="address-page">
            <Navbar />

            <div className="address-container">
                <h1 className="page-title">Manage Address</h1>

                <div className="address-grid">
                    <div className="address-form-card">
                        <h2 className="section-title">Add Address</h2>

                        <form onSubmit={saveAddress} className="address-form">
                            <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} className="address-input" required />
                            <input name="mobile" placeholder="Mobile Number" value={address.mobile} onChange={handleChange} className="address-input" required />
                            <input name="street" placeholder="Street" value={address.street} onChange={handleChange} className="address-input" required />
                            <input name="city" placeholder="City" value={address.city} onChange={handleChange} className="address-input" required />
                            <input name="state" placeholder="State" value={address.state} onChange={handleChange} className="address-input" required />
                            <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} className="address-input" required />
                            <input name="country" placeholder="Country" value={address.country} onChange={handleChange} className="address-input" required />

                            <button className="save-btn" type="submit">Save Address</button>
                        </form>
                    </div>

                    <div className="address-list">
                        <h2 className="section-title">Saved Addresses</h2>

                        {addresses.length === 0 ? (
                            <div className="empty-box">No Address Found</div>
                        ) : (
                            addresses.map((item) => (
                                <div key={item.id} className="address-card">
                                    <h3 className="address-name">{item.fullName}</h3>
                                    <div className="address-line">{item.mobile}</div>
                                    <div className="address-line">{item.street}</div>
                                    <div className="address-line">{item.city}, {item.state}</div>
                                    <div className="address-line">{item.pincode}</div>
                                    <div className="address-line">{item.country}</div>
                                    <div className="address-id">ID: {item.id}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Address;