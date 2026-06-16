import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const registerUser = async () => {

        try {

            if (name.length < 3) {
                alert("Name should be minimum 3 characters");
                return;
            }

            if (!email.includes("@")) {
                alert("Invalid Email");
                return;
            }

            if (password.length < 6) {
                alert("Password should be minimum 6 characters");
                return;
            }

            await API.post(
                "/api/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            alert("Registration Successful");

            navigate("/");

        } catch (error) {

            console.log(error);
            alert("Registration Failed");
        }
    };

    return (

        <div className="form-container">

            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "25px"
                }}
            >
                Register
            </h1>

            <form>

                <input
                    className="input-field"
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <input
                    className="input-field"
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    className="input-field"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    type="button"
                    className="primary-btn"
                    style={{
                        width: "100%",
                        marginTop: "20px"
                    }}
                    onClick={registerUser}
                >
                    Register
                </button>

                <div
                    style={{
                        marginTop: "20px",
                        textAlign: "center"
                    }}
                >
                    <Link to="/">
                        Already Have Account? Login
                    </Link>
                </div>

            </form>

        </div>
    );
}

export default Register;